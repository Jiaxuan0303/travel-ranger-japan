'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JigsawPuzzleGame } from '@/lib/types';
import type { MiniGameResult } from './MiniGameRenderer';

// ============================================================
// Constants
// ============================================================

/** 时间限制 (秒) */
const TIME_LIMITS: Record<number, number> = {
  3: 60,
  5: 480,
  8: 720,
};

/** 放大原图扣秒 */
const ENLARGE_PENALTY = 20;

/** 区域坍塌阈值 (秒) — 开始坍塌 / 完全坍塌 */
const ZONE_COLLAPSE: Record<number, { start: number; full: number }> = {
  3: { start: 16, full: 36 },
  5: { start: 40, full: 80 },
  8: { start: 60, full: 120 },
};

/** 干扰频率配置 (按剩余时间百分比) */
const INTERFERENCE_CONFIG = [
  { pctAbove: 70, intervalMin: 25, intervalMax: 35, durationMin: 5, durationMax: 7 },
  { pctAbove: 30, intervalMin: 15, intervalMax: 25, durationMin: 7, durationMax: 10 },
  { pctAbove: 0, intervalMin: 8, intervalMax: 15, durationMin: 10, durationMax: 12 },
];

/** 干扰类型权重 */
const INTERFERENCE_TYPES = [
  { type: 'rotate' as const, weight: 35 },
  { type: 'flash' as const, weight: 25 },
  { type: 'hide' as const, weight: 25 },
  { type: 'swap' as const, weight: 15 },
];

/** 干扰期间每次移动对各 zone 的 inactivity 惩罚 (秒) */
const INTERFERENCE_MOVE_PENALTY = 5;

// ============================================================
// Helpers
// ============================================================

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  if (shuffled.every((_, i) => (shuffled[i] as unknown as number) === i)) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }
  return shuffled;
}

function weightedRandom(weights: { type: InterferenceType; weight: number }[]): InterferenceType {
  const total = weights.reduce((s, w) => s + w.weight, 0);
  let r = Math.random() * total;
  for (const w of weights) {
    r -= w.weight;
    if (r <= 0) return w.type;
  }
  return weights[weights.length - 1].type;
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 返回 0..n-1 的不重复随机数 */
function randomUnique(count: number, max: number, exclude?: Set<number>): number[] {
  const pool: number[] = [];
  for (let i = 0; i < max; i++) {
    if (!exclude?.has(i)) pool.push(i);
  }
  // Fisher-Yates partial shuffle
  const n = Math.min(count, pool.length);
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(Math.random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

/** 区域颜色标识 (红·黄·蓝) */
const ZONE_COLORS = [
  { border: 'border-red-400/80', bg: 'bg-red-500/20', text: 'text-red-300', label: '红区', hex: '#f87171' },
  { border: 'border-yellow-400/80', bg: 'bg-yellow-500/20', text: 'text-yellow-300', label: '黄区', hex: '#facc15' },
  { border: 'border-blue-400/80', bg: 'bg-blue-500/20', text: 'text-blue-300', label: '蓝区', hex: '#60a5fa' },
];

/** 计算某个 slot 属于哪个 zone (最多3个)，每关分区不同 */
function getZoneIndex(slotIndex: number, gridSize: number, mode: number): number {
  const row = Math.floor(slotIndex / gridSize);
  const col = slotIndex % gridSize;

  if (gridSize === 3) {
    // 3×3: 按行分3区 (每行3格)
    return row; // 0, 1, 2
  }
  if (gridSize === 5) {
    // 5×5: 按列分3区 → 左2列 | 中2列 | 右1列
    if (col < 2) return 0;
    if (col < 4) return 1;
    return 2;
  }
  // 8×8: mode 决定分区方式 (每关不同)
  if (mode === 0) {
    // 上中下横条: 上3行 | 中2行 | 下3行
    if (row < 3) return 0;
    if (row < 5) return 1;
    return 2;
  }
  // 左中右竖条: 左3列 | 中2列 | 右3列
  if (col < 3) return 0;
  if (col < 5) return 1;
  return 2;
}

/** 计算每个 zone 的总格子数 (最多3个) */
function getZoneSizes(gridSize: number, mode: number): number[] {
  const sizes = [0, 0, 0];
  for (let i = 0; i < gridSize * gridSize; i++) {
    sizes[getZoneIndex(i, gridSize, mode)]++;
  }
  return sizes;
}

// ============================================================
// Types
// ============================================================

type InterferenceType = 'rotate' | 'flash' | 'hide' | 'swap';

interface ZoneState {
  /** 该 zone 中已正确放置的块数 */
  correctCount: number;
  /** 无正确放置的连续秒数 */
  inactivitySeconds: number;
  /** 坍塌进度 0-100 */
  collapsePct: number;
}

interface InterferenceState {
  active: boolean;
  type: InterferenceType | null;
  /** 受影响的 slot index 列表 */
  affectedSlots: number[];
}

interface DeathState {
  dead: boolean;
  reason: 'timeout' | 'collapse' | null;
  collapsedZone: number | null;
}

interface JigsawGameProps {
  game: JigsawPuzzleGame;
  onComplete: (result: MiniGameResult) => void;
  onReturn?: () => void; // 死亡后返回城市
}

// ============================================================
// Component
// ============================================================

export function JigsawGame({ game, onComplete, onReturn }: JigsawGameProps) {
  const { gridSize, imageUrl, instruction } = game;
  const totalPieces = gridSize * gridSize;
  const totalTime = TIME_LIMITS[gridSize] ?? 120;
  // 第一关 (3×3) 无区域坍塌 & 无动态干扰
  const hasZoneCollapse = gridSize > 3;
  const hasInterference = gridSize > 3;
  // 8×8 有两种分区模式，根据 imageUrl 哈希区分 (不同城市不同分区)
  const zoneMode = useMemo(() => (gridSize === 8 ? (imageUrl.length % 2) : 0), [gridSize, imageUrl]);
  const zoneSizes = useMemo(() => getZoneSizes(gridSize, zoneMode), [gridSize, zoneMode]);

  // ---- Core puzzle state ----
  const [pieceOrder, setPieceOrder] = useState<number[]>(() =>
    shuffleArray(Array.from({ length: totalPieces }, (_, i) => i))
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const completedRef = useRef(false);
  const [completed, setCompleted] = useState(false);
  const [gameId, setGameId] = useState(0); // 每次重置递增，强制 framer-motion 重新挂载

  // ---- Timer ----
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [showEnlarged, setShowEnlarged] = useState(false);
  const enlargePenaltyApplied = useRef(false);

  // ---- Zone collapse ----
  const [zones, setZones] = useState<ZoneState[]>(() =>
    Array.from({ length: 3 }, () => ({ correctCount: 0, inactivitySeconds: 0, collapsePct: 0 }))
  );
  const [activeCollapseZone, setActiveCollapseZone] = useState<number | null>(null); // 当前坍塌中的区块 (同时只一个)

  // ---- Interference ----
  const [interference, setInterference] = useState<InterferenceState>({
    active: false,
    type: null,
    affectedSlots: [],
  });
  const [pieceRotations, setPieceRotations] = useState<Record<number, number>>({});
  const [hiddenSlots, setHiddenSlots] = useState<Set<number>>(new Set());
  const [flashingSlots, setFlashingSlots] = useState<Set<number>>(new Set());
  const interferenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interferenceEndRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interferenceActiveRef = useRef(false);

  // ---- Death ----
  const [death, setDeath] = useState<DeathState>({ dead: false, reason: null, collapsedZone: null });

  // ---- Refs for tick callbacks (避免闭包陈旧) ----
  const pieceOrderRef = useRef(pieceOrder);
  pieceOrderRef.current = pieceOrder;
  const zonesRef = useRef(zones);
  zonesRef.current = zones;
  const timeLeftRef = useRef(timeLeft);
  timeLeftRef.current = timeLeft;
  const completedRefLocal = useRef(false);
  const deathRef = useRef(death);
  deathRef.current = death;
  const interferenceRef = useRef(interference);
  interferenceRef.current = interference;
  const movesRef = useRef(moves);
  movesRef.current = moves;
  const interferenceActiveRefLocal = useRef(false);

  // ============================================================
  // Derived state
  // ============================================================

  const isCorrect = useMemo(
    () => pieceOrder.every((piece, slot) => piece === slot),
    [pieceOrder]
  );

  // Time display
  const timeDisplay = useMemo(() => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  const timePct = (timeLeft / totalTime) * 100;
  const timeUrgent = timeLeft <= 10;

  // ============================================================
  // Reset helper
  // ============================================================

  const resetGame = useCallback(() => {
    completedRef.current = false;
    completedRefLocal.current = false;
    setCompleted(false);
    setPieceOrder(shuffleArray(Array.from({ length: totalPieces }, (_, i) => i)));
    setMoves(0);
    setTimeLeft(totalTime);
    enlargePenaltyApplied.current = false;
    setShowEnlarged(false);
    setZones(
      Array.from({ length: 3 }, () => ({ correctCount: 0, inactivitySeconds: 0, collapsePct: 0 }))
    );
    setActiveCollapseZone(null);
    setInterference({ active: false, type: null, affectedSlots: [] });
    interferenceActiveRef.current = false;
    interferenceActiveRefLocal.current = false;
    setPieceRotations({});
    setHiddenSlots(new Set());
    setFlashingSlots(new Set());
    setDeath({ dead: false, reason: null, collapsedZone: null });
    setDraggedIndex(null);
    setDragOverIndex(null);
    setGameId((g) => g + 1);
  }, [totalPieces, totalTime]);

  // ============================================================
  // Timer tick
  // ============================================================

  useEffect(() => {
    if (completed || death.dead) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up
          setDeath({ dead: true, reason: 'timeout', collapsedZone: null });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [completed, death.dead]);

  // ============================================================
  // Zone collapse tick (单区块坍塌)
  // ============================================================

  useEffect(() => {
    if (completed || death.dead || !hasZoneCollapse) return;
    const config = ZONE_COLLAPSE[gridSize] ?? ZONE_COLLAPSE[5];
    const NUM_ZONES = 3;

    const interval = setInterval(() => {
      setZones((prev) => {
        const order = pieceOrderRef.current;

        // Recompute correct counts per zone
        const newZones: ZoneState[] = prev.map((_z, zi) => {
          let correct = 0;
          for (let slot = 0; slot < totalPieces; slot++) {
            if (getZoneIndex(slot, gridSize, zoneMode) === zi && order[slot] === slot) {
              correct++;
            }
          }
          return { ...prev[zi], correctCount: correct };
        });

        // Pick the worst zone (lowest correct % relative to size)
        let worstZi = 0;
        let worstRatio = 1;
        for (let zi = 0; zi < NUM_ZONES; zi++) {
          const ratio = newZones[zi].correctCount / Math.max(1, zoneSizes[zi]);
          if (ratio < worstRatio) {
            worstRatio = ratio;
            worstZi = zi;
          }
        }

        // Only the worst zone accumulates inactivity (同时只坍塌一个)
        for (let zi = 0; zi < NUM_ZONES; zi++) {
          if (zi === worstZi && newZones[zi].correctCount < zoneSizes[zi]) {
            newZones[zi] = {
              ...newZones[zi],
              inactivitySeconds: newZones[zi].inactivitySeconds + 1,
            };
          } else if (zi !== worstZi) {
            // Other zones recover (缓慢衰减)
            newZones[zi] = {
              ...newZones[zi],
              inactivitySeconds: Math.max(0, newZones[zi].inactivitySeconds - 1),
            };
          }
        }

        // Calculate collapse %
        for (let zi = 0; zi < NUM_ZONES; zi++) {
          newZones[zi] = {
            ...newZones[zi],
            collapsePct: Math.max(
              0,
              Math.min(100, ((newZones[zi].inactivitySeconds - config.start) / (config.full - config.start)) * 100)
            ),
          };
        }

        // Update active collapse zone
        setActiveCollapseZone(newZones[worstZi].collapsePct > 0 ? worstZi : null);

        // Full collapse check
        for (let zi = 0; zi < NUM_ZONES; zi++) {
          if (newZones[zi].collapsePct >= 100) {
            setDeath({ dead: true, reason: 'collapse', collapsedZone: zi });
            return newZones;
          }
        }

        return newZones;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [completed, death.dead, gridSize, totalPieces, zoneMode, zoneSizes, hasZoneCollapse]);

  // ============================================================
  // Interference scheduler
  // ============================================================

  useEffect(() => {
    if (completed || death.dead || !hasInterference) return;

    let timeout: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      const remaining = timeLeftRef.current;
      const pct = (remaining / totalTime) * 100;
      const cfg =
        INTERFERENCE_CONFIG.find((c) => pct > c.pctAbove) ?? INTERFERENCE_CONFIG[INTERFERENCE_CONFIG.length - 1];
      const delay = randomBetween(cfg.intervalMin, cfg.intervalMax) * 1000;

      timeout = setTimeout(() => {
        if (completedRefLocal.current || deathRef.current.dead) return;

        const duration = randomBetween(cfg.durationMin, cfg.durationMax) * 1000;
        const iType = weightedRandom(INTERFERENCE_TYPES);
        const order = pieceOrderRef.current;

        // Determine affected slots based on interference type
        let affectedSlots: number[] = [];
        const correctSlots = new Set<number>();
        for (let i = 0; i < order.length; i++) {
          if (order[i] === i) correctSlots.add(i);
        }

        switch (iType) {
          case 'rotate': {
            // Pick 2-5 incorrect slots, rotate the PIECES at those slots
            const count = Math.min(randomBetween(2, 5), totalPieces - correctSlots.size);
            affectedSlots = randomUnique(count, totalPieces, correctSlots);
            const affectedPieceIds = affectedSlots.map((s) => order[s]); // 碎片ID，非位置
            setPieceRotations((prev) => {
              const next = { ...prev };
              for (const pieceId of affectedPieceIds) {
                const degs = [90, 180, 270];
                next[pieceId] = (prev[pieceId] ?? 0) + degs[Math.floor(Math.random() * degs.length)];
              }
              return next;
            });
            break;
          }
          case 'flash': {
            // Pick a random zone and flash all its non-correct slots
            const zi = Math.floor(Math.random() * 3);
            const flashSlots: number[] = [];
            for (let s = 0; s < totalPieces; s++) {
              if (getZoneIndex(s, gridSize, zoneMode) === zi && !correctSlots.has(s)) {
                flashSlots.push(s);
              }
            }
            affectedSlots = flashSlots;
            setFlashingSlots(new Set(flashSlots));
            break;
          }
          case 'hide': {
            const count = Math.min(randomBetween(2, 4), totalPieces - correctSlots.size);
            affectedSlots = randomUnique(count, totalPieces, correctSlots);
            setHiddenSlots(new Set(affectedSlots));
            break;
          }
          case 'swap': {
            // Swap exactly 1 pair (2 incorrect pieces)
            const candidates = randomUnique(2, totalPieces, correctSlots);
            if (candidates.length === 2) {
              affectedSlots = candidates;
              setPieceOrder((prev) => {
                const next = [...prev];
                [next[candidates[0]], next[candidates[1]]] = [next[candidates[1]], next[candidates[0]]];
                return next;
              });
            }
            break;
          }
        }

        setInterference({ active: true, type: iType, affectedSlots });
        interferenceActiveRef.current = true;
        interferenceActiveRefLocal.current = true;

        // End interference after duration
        interferenceEndRef.current = setTimeout(() => {
          setInterference({ active: false, type: null, affectedSlots: [] });
          interferenceActiveRef.current = false;
          interferenceActiveRefLocal.current = false;
          setFlashingSlots(new Set());
          setHiddenSlots(new Set());
          scheduleNext();
        }, duration);
      }, delay);
    };

    scheduleNext();

    return () => {
      clearTimeout(timeout);
      if (interferenceEndRef.current) clearTimeout(interferenceEndRef.current);
    };
  }, [completed, death.dead, totalPieces, totalTime, gridSize, zoneMode, hasInterference]);

  // ============================================================
  // Completion detection
  // ============================================================

  useEffect(() => {
    if (isCorrect && !completedRef.current && !death.dead) {
      completedRef.current = true;
      completedRefLocal.current = true;
      setCompleted(true);
      const timer = setTimeout(() => {
        onComplete({
          score: Math.max(10, 100 - movesRef.current * 2),
          perfect: movesRef.current <= totalPieces + 4,
          moves: movesRef.current,
        });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isCorrect, totalPieces, onComplete, death.dead]);

  // ============================================================
  // Enlarge image penalty
  // ============================================================

  const handleOpenEnlarged = useCallback(() => {
    if (completed || death.dead) return;
    setShowEnlarged(true);
    if (!enlargePenaltyApplied.current) {
      enlargePenaltyApplied.current = true;
      setTimeLeft((prev) => {
        const next = prev - ENLARGE_PENALTY;
        if (next <= 0) {
          setDeath({ dead: true, reason: 'timeout', collapsedZone: null });
          return 0;
        }
        return next;
      });
    }
  }, [completed, death.dead]);

  const handleCloseEnlarged = useCallback(() => {
    setShowEnlarged(false);
  }, []);

  // ============================================================
  // Drag handlers
  // ============================================================

  const handleDragStart = (slotIndex: number) => {
    if (completed || death.dead) return;
    if (hiddenSlots.has(slotIndex)) return;
    setDraggedIndex(slotIndex);
  };

  const handleDragOver = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== slotIndex) {
      setDragOverIndex(slotIndex);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (targetSlot: number) => {
    if (draggedIndex === null || draggedIndex === targetSlot || completed || death.dead) return;

    const src = draggedIndex;
    const dst = targetSlot;

    setPieceOrder((prev) => {
      const next = [...prev];
      [next[src], next[dst]] = [next[dst], next[src]];

      // 拼对位置后清除该碎片的旋转 (按碎片ID)
      const toClear: number[] = [];
      if (next[src] === src) toClear.push(next[src]); // pieceId that landed correctly
      if (next[dst] === dst && dst !== src) toClear.push(next[dst]);
      if (toClear.length > 0) {
        setPieceRotations((rot) => {
          const updated = { ...rot };
          for (const pid of toClear) delete updated[pid];
          return updated;
        });
      }

      return next;
    });
    setMoves((m) => m + 1);
    setDraggedIndex(null);
    setDragOverIndex(null);

    // During interference: penalty to all zone inactivity
    if (interferenceActiveRefLocal.current) {
      setZones((prev) =>
        prev.map((z) => ({
          ...z,
          inactivitySeconds: z.inactivitySeconds + INTERFERENCE_MOVE_PENALTY,
        }))
      );
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // ============================================================
  // Computed piece styles
  // ============================================================

  const getPieceVisualState = (slotIndex: number) => {
    const zoneIdx = getZoneIndex(slotIndex, gridSize, zoneMode);
    const zone = zones[zoneIdx];
    const collapsePct = zone?.collapsePct ?? 0;
    const isHidden = hiddenSlots.has(slotIndex);
    const isFlashing = flashingSlots.has(slotIndex);
    const pieceId = pieceOrder[slotIndex]; // 该位置上的碎片ID
    const rotation = pieceRotations[pieceId] ?? 0; // 旋转跟随碎片，不跟随位置
    const isCorrectPiece = pieceId === slotIndex;
    const isInActiveCollapse = activeCollapseZone === zoneIdx && collapsePct > 0;

    return { zoneIdx, collapsePct, isHidden, isFlashing, rotation, isCorrectPiece, isInActiveCollapse };
  };

  // ============================================================
  // Render
  // ============================================================

  return (
    <div className="space-y-4">
      {/* ---- 顶部栏: 计时器 + 放大按钮 ---- */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-100 mb-1">拼图挑战</h3>
          <p className="text-sm text-slate-400">{instruction}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* 放大原图按钮 */}
          <button
            onClick={handleOpenEnlarged}
            disabled={completed || death.dead}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-500 hover:bg-slate-700/60 transition-colors disabled:opacity-40"
          >
            <span>🔍</span> 原图
          </button>
          {/* 计时器 */}
          <div
            className={`rounded-lg border px-4 py-2 text-lg font-mono font-bold tabular-nums transition-colors ${
              timeUrgent
                ? 'border-red-500/50 bg-red-500/10 text-red-400 animate-pulse'
                : timePct < 30
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                : 'border-slate-600/50 bg-slate-800/60 text-slate-200'
            }`}
          >
            ⏱ {timeDisplay}
          </div>
        </div>
      </div>

      {/* ---- 参考缩略图区 ---- */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-700/70 bg-slate-900/60 px-4 py-2">
        <span className="text-xs text-slate-500 shrink-0">参考图:</span>
        <div
          className="h-16 w-16 overflow-hidden rounded-lg border border-slate-600/50 cursor-pointer hover:ring-2 hover:ring-indigo-400/50 transition-all"
          onClick={handleOpenEnlarged}
        >
          <img
            src={imageUrl}
            alt="参考缩略图"
            className="h-full w-full object-cover"
          />
        </div>
        <span className="text-xs text-slate-500">
          拖动方块交换位置，拼成完整图片 — 点击缩略图或「🔍 原图」放大查看 (扣{ENLARGE_PENALTY}秒)
        </span>
        {interference.active && (
          <span className="ml-auto shrink-0 rounded-full bg-red-500/15 border border-red-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-red-400 animate-pulse">
            ⚡ {interference.type === 'rotate' ? '旋转干扰' : interference.type === 'flash' ? '闪烁干扰' : interference.type === 'hide' ? '消失干扰' : '换位干扰'}
          </span>
        )}
      </div>

      {/* ---- 区域坍塌机制说明 (仅5×5及以上) ---- */}
      {hasZoneCollapse && (
      <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-2.5">
        <div className="flex items-start gap-2">
          <span className="text-sm shrink-0 mt-0.5">🧱</span>
          <div>
            <p className="text-xs font-semibold text-amber-300 mb-1">区域坍塌机制</p>
            <p className="text-[11px] leading-relaxed text-slate-400">
              拼图盘分为 <span className="text-red-400 font-medium">🔴红区</span>·<span className="text-yellow-400 font-medium">🟡黄区</span>·<span className="text-blue-400 font-medium">🔵蓝区</span> 3个区块（每关分区不同）。
              每个碎片右上角有<span className="text-slate-300">颜色标识</span>标明所属区块。
              同时只有<span className="text-red-400 font-medium">完成度最低的1个区块</span>在坍塌（带🔥标记），其它区块不会同时坍塌。
              坍塌过程：<span className="text-yellow-400">变暗</span> → <span className="text-orange-400">裂纹</span> → <span className="text-red-400">碎裂掉落</span> → 死亡。
              在该区块中正确放置碎片可<span className="text-emerald-400 font-medium">完全重置</span>坍塌进度。
            </p>
          </div>
        </div>
      </div>
      )}

      {/* ---- 拼图网格 ---- */}
      <div
        className="relative mx-auto aspect-square w-full max-w-[420px] select-none"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          gap: '3px',
        }}
      >
        {pieceOrder.map((correctPieceId, slotIndex) => {
          const row = Math.floor(correctPieceId / gridSize);
          const col = correctPieceId % gridSize;
          const isDragging = draggedIndex === slotIndex;
          const isDragOver = dragOverIndex === slotIndex;
          const { zoneIdx, collapsePct, isHidden, isFlashing, rotation, isCorrectPiece, isInActiveCollapse } =
            getPieceVisualState(slotIndex);

          // Zone collapse visuals
          const brightness = 1 - collapsePct / 100 * 0.6; // 1 → 0.4
          const opacity = isHidden ? 0.05 : (collapsePct > 60 ? 1 - (collapsePct - 60) / 40 * 0.5 : 1);
          const shakeIntensity = collapsePct > 30 ? (collapsePct - 30) / 70 : 0;

          return (
            <motion.div
              key={`${gameId}-${slotIndex}`}
              draggable={!completed && !death.dead && !isHidden}
              onDragStart={() => handleDragStart(slotIndex)}
              onDragOver={(e) => handleDragOver(e, slotIndex)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(slotIndex)}
              onDragEnd={handleDragEnd}
              animate={
                collapsePct >= 90 && zoneIdx === death.collapsedZone
                  ? { y: 60, opacity: 0, rotate: 15 + Math.random() * 10, scale: 0.8 }
                  : shakeIntensity > 0
                  ? {
                      x: [0, -shakeIntensity * 3, shakeIntensity * 3, -shakeIntensity * 2, shakeIntensity * 2, 0],
                      y: [0, shakeIntensity * 2, -shakeIntensity * 2, shakeIntensity * 1.5, -shakeIntensity, 0],
                      rotate: rotation || 0,
                    }
                  : rotation
                  ? { rotate: rotation }
                  : {}
              }
              transition={
                collapsePct >= 90
                  ? { duration: 0.5, ease: 'easeIn' }
                  : shakeIntensity > 0
                  ? { duration: 0.4, repeat: Infinity, ease: 'linear' }
                  : { duration: 0.15 }
              }
              className={`relative cursor-grab rounded-md transition-all ${
                completed
                  ? 'cursor-default'
                  : isDragging
                  ? 'z-10 scale-105 opacity-70 shadow-xl shadow-indigo-500/40'
                  : isDragOver
                  ? 'z-10 scale-105 ring-2 ring-amber-400/70 shadow-lg shadow-amber-500/30'
                  : !isHidden && !death.dead
                  ? 'hover:scale-[1.02] hover:shadow-md hover:shadow-indigo-500/15'
                  : ''
              }`}
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                backgroundPosition: `${(col / (gridSize - 1)) * 100}% ${(row / (gridSize - 1)) * 100}%`,
                aspectRatio: '1',
                filter: collapsePct > 0 ? `brightness(${brightness})` : undefined,
                opacity,
              }}
            >
              {/* Collapse crack overlay */}
              {collapsePct > 30 && (
                <div
                  className="absolute inset-0 rounded-md pointer-events-none z-10"
                  style={{
                    background: `
                      radial-gradient(circle at ${20 + Math.random() * 60}% ${20 + Math.random() * 60}%, transparent 40%, rgba(0,0,0,${0.1 + (collapsePct - 30) / 70 * 0.5}) 100%),
                      linear-gradient(${30 + collapsePct * 0.5}deg, transparent 30%, rgba(255,0,0,${(collapsePct - 50) / 100 * 0.3}) 50%, transparent 70%)
                    `,
                  }}
                />
              )}

              {/* Flash overlay */}
              {isFlashing && (
                <div
                  className="absolute inset-0 rounded-md pointer-events-none z-10 animate-pulse"
                  style={{ backgroundColor: 'rgba(255,255,255,0.4)' }}
                />
              )}

              {/* Hidden overlay */}
              {isHidden && (
                <div className="absolute inset-0 rounded-md bg-slate-900/90 pointer-events-none z-10 flex items-center justify-center">
                  <span className="text-xs text-slate-600">???</span>
                </div>
              )}

              {/* Zone color corner marker */}
              {!completed && !death.dead && hasZoneCollapse && (
                <div
                  className="absolute top-0 right-0 w-3.5 h-3.5 rounded-bl-md z-20 pointer-events-none"
                  style={{
                    backgroundColor: ZONE_COLORS[zoneIdx].hex,
                    opacity: 0.7,
                    borderLeft: '1px solid rgba(255,255,255,0.3)',
                    borderBottom: '1px solid rgba(255,255,255,0.3)',
                  }}
                  title={`${ZONE_COLORS[zoneIdx].label} - 此碎片所属区块`}
                />
              )}

              {/* Active collapse danger ring */}
              {isInActiveCollapse && !isCorrectPiece && (
                <div
                  className="absolute -inset-[2px] rounded-md pointer-events-none z-10 border-2 animate-pulse"
                  style={{
                    borderColor: ZONE_COLORS[zoneIdx].hex,
                    boxShadow: collapsePct > 60 ? `0 0 10px ${ZONE_COLORS[zoneIdx].hex}` : 'none',
                    opacity: 0.9,
                  }}
                />
              )}

              {/* Border indicator */}
              {!completed && !death.dead && (
                <div
                  className={`absolute inset-0 rounded-md border-2 pointer-events-none ${
                    isCorrectPiece ? 'border-emerald-400/60' : ZONE_COLORS[zoneIdx].border
                  }`}
                />
              )}
              {completed && (
                <div className="absolute inset-0 rounded-md border-2 border-emerald-400/60 pointer-events-none" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ---- 区块状态指示 (仅5×5及以上) ---- */}
      {hasZoneCollapse && (
      <div className="flex gap-2 justify-center">
        {zones.map((z, zi) => {
          const isActive = activeCollapseZone === zi;
          const zoneSize = zoneSizes[zi] ?? 1;
          return (
            <div
              key={zi}
              className={`rounded-lg border px-2.5 py-1 text-[10px] font-medium transition-all ${
                z.collapsePct > 60
                  ? 'border-red-500/40 bg-red-500/10 text-red-400'
                  : z.collapsePct > 30
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                  : z.collapsePct > 0
                  ? 'border-yellow-500/30 bg-yellow-500/5 text-yellow-400'
                  : `${ZONE_COLORS[zi].border} ${ZONE_COLORS[zi].bg} ${ZONE_COLORS[zi].text}`
              } ${isActive ? 'ring-1 ring-red-500/50 scale-105' : ''}`}
            >
              <span className={`mr-1 ${ZONE_COLORS[zi].text}`}>
                {['🔴', '🟡', '🔵'][zi]}
              </span>
              {ZONE_COLORS[zi].label} {z.correctCount}/{zoneSize}
              {z.collapsePct > 0 && ` ⚠${Math.round(z.collapsePct)}%`}
              {isActive && z.collapsePct > 0 && ' 🔥'}
            </div>
          );
        })}
      </div>
      )}

      {/* ---- 完成提示 ---- */}
      {completed && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-200">
          🎉 拼图完成！共用了 {moves} 步，奖励已进入结算。
        </div>
      )}

      {!completed && !death.dead && (
        <p className="text-center text-xs text-slate-600">
          拖拽方块到目标位置即可交换 — 参考左上角缩略图拼出完整画面
          {interference.active && ' — ⚠ 干扰中！移动将加速区域坍塌'}
        </p>
      )}

      {/* ---- 放大原图模态框 ---- */}
      <AnimatePresence>
        {showEnlarged && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={handleCloseEnlarged}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] max-w-[90vw] rounded-2xl overflow-hidden border border-slate-600/50 shadow-2xl"
            >
              <img src={imageUrl} alt="原图" className="max-h-[85vh] max-w-[85vw] object-contain" />
              <button
                onClick={handleCloseEnlarged}
                className="absolute top-3 right-3 rounded-full bg-black/60 border border-white/20 w-8 h-8 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 border border-white/10 px-3 py-1.5 text-xs text-slate-300">
                {enlargePenaltyApplied.current ? `已扣除 ${ENLARGE_PENALTY} 秒 (仅扣一次)` : '查看原图'}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- 死亡画面 ---- */}
      <AnimatePresence>
        {death.dead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="text-center max-w-sm"
            >
              {/* Death icon */}
              <motion.div
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💀
              </motion.div>

              <h2 className="text-2xl font-bold text-red-400 mb-2">挑战失败</h2>

              <p className="text-sm text-slate-400 mb-1">
                {death.reason === 'timeout' ? '⏱ 时间耗尽' : '🧱 区域坍塌'}
              </p>
              <p className="text-xs text-slate-600 mb-8">
                {death.reason === 'timeout'
                  ? '拼图时间已用完，未能完成挑战。'
                  : `第 ${(death.collapsedZone ?? 0) + 1} 区块完全坍塌！长时间未在该区域放置正确碎片。`}
              </p>

              {/* 红色裂纹装饰 */}
              <div className="mb-8 flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-8 rounded-full bg-red-500/60"
                    animate={{ scaleY: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 1, delay: i * 0.15, repeat: Infinity }}
                  />
                ))}
              </div>

              <div className="space-y-3">
                <button
                  onClick={resetGame}
                  className="w-full rounded-xl bg-red-600 hover:bg-red-500 py-3 text-sm font-semibold text-white transition-colors shadow-lg shadow-red-500/25"
                >
                  🔄 重新挑战
                </button>
                <button
                  onClick={onReturn ?? (() => window.history.back())}
                  className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 hover:bg-slate-700/60 py-3 text-sm font-semibold text-slate-300 transition-colors"
                >
                  ← 返回
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
