import { NextRequest, NextResponse } from 'next/server';
import type { QuestContext, AIMessage } from '@/components/ai/aiEngine';
import { getAIResponse } from '@/components/ai/aiEngine';

const API_KEY = process.env.DEEPSEEK_API_KEY || '';
const BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';

function buildSystemPrompt(q: QuestContext): string {
  const knowledge = q.knowledge.map((k, i) => `${i + 1}. ${k}`).join('\n');
  return `你是一位热情的日本旅行学习助手，正在帮助用户学习「${q.questTitle}」。

## 当前任务
- 标题：${q.questTitle}
- 简介：${q.questDescription}
- 城市：${q.cityName}（${q.cityNameJa}）
- 主题：${q.skillTag}

## 知识库
${knowledge}

## 规则
1. 只回答与当前任务相关的问题。无关问题回复"该问题与当前学习内容无关"并引导回主题。
2. 回答简洁、结构化，200字以内。
3. 结尾附1-2个延伸问题，用"💬 "开头。
4. 中文回答，适当用emoji，语气热情像旅行向导。`;
}

function parseResponse(text: string): { content: string; suggestions: string[] } {
  const lines = text.split('\n');
  const body: string[] = [];
  const suggestions: string[] = [];
  for (const line of lines) {
    if (line.trim().startsWith('💬')) {
      suggestions.push(line.replace(/^💬\s*/, '').trim());
    } else {
      body.push(line);
    }
  }
  return { content: body.join('\n').trim(), suggestions: suggestions.slice(0, 2) };
}

export async function POST(req: NextRequest) {
  let userMsg = '';
  let ctx: QuestContext | null = null;
  let chatHistory: AIMessage[] = [];

  // 解析请求
  try {
    const body = await req.json();
    userMsg = body.message || '';
    ctx = body.questContext || null;
    chatHistory = body.history || [];
  } catch {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 });
  }

  if (!userMsg || !ctx) {
    return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
  }

  // 尝试调用 DeepSeek API
  if (API_KEY) {
    try {
      const messages = [
        { role: 'system', content: buildSystemPrompt(ctx) },
        ...chatHistory.slice(-8).map((m) => ({
          role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
          content: m.content,
        })),
        { role: 'user' as const, content: userMsg },
      ];

      const res = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          max_tokens: 600,
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content || '';
        return NextResponse.json(parseResponse(text));
      }
      console.error('DeepSeek API error:', res.status);
    } catch (e) {
      console.error('DeepSeek API exception:', e);
    }
  }

  // 兜底：本地引擎
  const fallback = await getAIResponse(userMsg, ctx, chatHistory);
  return NextResponse.json(fallback);
}
