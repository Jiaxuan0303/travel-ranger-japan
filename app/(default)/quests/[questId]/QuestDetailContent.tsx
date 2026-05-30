'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { questsById } from '@/data/quests';
import { useQuests } from '@/hooks/usePlayer';
import { PageTransition, SlideUp } from '@/components/animation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DIFFICULTY_LABELS } from '@/lib/types';

export function QuestDetailContent({ questId }: { questId: string }) {
  const quest = questsById[questId];
  const { quests, dispatch } = useQuests();
  const router = useRouter();

  const [step, setStep] = useState<'intro' | 'video' | 'quiz' | 'result'>('intro');
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!quest) {
    return (
      <PageTransition>
        <div className="text-center py-20 text-slate-500">任务不存在</div>
      </PageTransition>
    );
  }

  const alreadyDone = quests.completed.includes(quest.id);

  const handleStart = () => {
    dispatch({ type: 'QUEST_START', questId: quest.id });
    setStep('video');
  };

  const handleVideoDone = () => {
    dispatch({ type: 'VIDEO_WATCHED', questId: quest.id });
    setStep('quiz');
  };

  const handleAnswerSelect = (qIndex: number, optionIndex: number) => {
    const next = [...selectedAnswers];
    next[qIndex] = optionIndex;
    setSelectedAnswers(next);
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    let correctCount = 0;
    quest.quiz.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctIndex) correctCount++;
    });

    dispatch({ type: 'QUIZ_PASSED', questId: quest.id, correctCount });
    dispatch({ type: 'QUEST_COMPLETE', questId: quest.id, cityId: quest.cityId });
    setStep('result');
  };

  return (
    <PageTransition>
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-slate-400 hover:text-slate-200 text-sm mb-3 transition-colors"
        >
          ← 返回
        </button>
        <h1 className="text-xl font-bold text-slate-100">{quest.title}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge
            color={
              quest.difficulty === 1
                ? 'bg-emerald-500/20 text-emerald-400'
                : quest.difficulty === 2
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-red-500/20 text-red-400'
            }
          >
            {DIFFICULTY_LABELS[quest.difficulty]}
          </Badge>
          <span className="text-xs text-slate-500">⭐ {quest.xpReward} EXP</span>
        </div>
      </div>

      {step === 'intro' && (
        <SlideUp>
          <Card>
            <p className="text-slate-300 mb-4">{quest.description}</p>
            <div className="text-sm text-slate-500 mb-4">
              📹 视频时长：{Math.floor(quest.durationSec / 60)}分{quest.durationSec % 60}秒
            </div>
            <Button onClick={handleStart} className="w-full" disabled={alreadyDone}>
              {alreadyDone ? '已完成' : '开始任务'}
            </Button>
          </Card>
        </SlideUp>
      )}

      {step === 'video' && (
        <SlideUp>
          <Card>
            <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center mb-4">
              <div className="text-center text-slate-500">
                <div className="text-4xl mb-2">🎬</div>
                <p>视频播放区域</p>
                <p className="text-xs mt-1">{quest.videoUrl}</p>
              </div>
            </div>
            <Button onClick={handleVideoDone} className="w-full">
              观看完毕，进入答题
            </Button>
          </Card>
        </SlideUp>
      )}

      {step === 'quiz' && (
        <div className="space-y-4">
          {quest.quiz.map((q, qi) => (
            <SlideUp key={qi} delay={qi * 0.1}>
              <Card>
                <h3 className="font-medium text-slate-200 mb-3">
                  第{qi + 1}题：{q.question}
                </h3>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = selectedAnswers[qi] === oi;
                    const isCorrect = quizSubmitted && oi === q.correctIndex;
                    const isWrong = quizSubmitted && isSelected && oi !== q.correctIndex;

                    return (
                      <button
                        key={oi}
                        onClick={() => !quizSubmitted && handleAnswerSelect(qi, oi)}
                        disabled={quizSubmitted}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          isCorrect
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : isWrong
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : isSelected
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {String.fromCharCode(65 + oi)}. {opt}
                      </button>
                    );
                  })}
                </div>
              </Card>
            </SlideUp>
          ))}
          <Button
            onClick={handleQuizSubmit}
            className="w-full"
            disabled={selectedAnswers.length < quest.quiz.length || quizSubmitted}
          >
            提交答案
          </Button>
        </div>
      )}

      {step === 'result' && (
        <SlideUp>
          <Card className="text-center py-6">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-bold text-white mb-2">任务完成！</h2>
            <p className="text-slate-400 mb-4">
              获得了 <span className="text-amber-400 font-bold">+{quest.xpReward}</span> 经验值
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.push('/quests')} variant="secondary">
                返回任务板
              </Button>
              <Button onClick={() => router.push(`/cities/${quest.cityId}`)}>
                前往城市
              </Button>
            </div>
          </Card>
        </SlideUp>
      )}
    </PageTransition>
  );
}
