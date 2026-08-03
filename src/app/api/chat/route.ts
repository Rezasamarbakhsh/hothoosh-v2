import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'ابتدا وارد شوید' }, { status: 401 });
  }

  const user = session.user as Record<string, unknown>;
  const companyId = user.companyId as string | null;

  const body = await req.json();
  const { messages } = body as { messages: Array<{ role: string; content: string }> };

  if (!messages?.length || !messages[messages.length - 1]?.content?.trim()) {
    return NextResponse.json({ error: 'پیام خالی است' }, { status: 400 });
  }

  // Get an active API key (shared, not per-company)
  const apiKey = await db.apiKey.findFirst({
    where: { status: 'active' },
    orderBy: { lastUsedAt: 'asc' },
  });

  if (!apiKey) {
    return NextResponse.json({
      error: 'هیچ کلید API فعالی ثبت نشده. لطفاً از پنل مدیریت یک کلید API اضافه کنید.',
    }, { status: 503 });
  }

  const userMessage = messages[messages.length - 1];

  // Build system prompt with company context
  let systemPrompt = 'تو یک دستیار هوشمند سازمانی به نام هات‌هوش هستی. به زبان فارسی پاسخ بده و پاسخ‌های مفید و حرفه‌ای ارائه بده.';

  if (companyId) {
    const company = await db.company.findUnique({
      where: { id: companyId },
      select: { name: true, description: true },
    });
    if (company) {
      systemPrompt += `\n\nاطلاعات شرکت کاربر:\n- نام: ${company.name}\n- توضیحات: ${company.description ?? 'ندارد'}\n\nپاسخ‌هایت باید مرتبط با فعالیت و حوزه این شرکت باشد.`;
    }
  }

  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  try {
    const startTime = Date.now();

    let responseText = '';

    if (apiKey.provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.key}`,
        },
        body: JSON.stringify({
          model: apiKey.model || 'gpt-4o-mini',
          messages: apiMessages,
          max_tokens: 2048,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        console.error('OpenAI API error:', res.status, errData);
        return NextResponse.json({
          error: `خطا در ارتباط با OpenAI (${res.status})`,
        }, { status: 502 });
      }

      const data = await res.json();
      responseText = data.choices?.[0]?.message?.content ?? 'پاسخی دریافت نشد.';

      // Update API key usage stats
      const inputTokens = data.usage?.prompt_tokens ?? 0;
      const outputTokens = data.usage?.completion_tokens ?? 0;
      const latencyMs = Date.now() - startTime;

      await db.apiKey.update({
        where: { id: apiKey.id },
        data: {
          totalRequests: { increment: 1 },
          totalTokens: { increment: inputTokens + outputTokens },
          lastUsedAt: new Date(),
        },
      });

      // Log usage
      await db.usageLog.create({
        data: {
          userId: user.id as string,
          companyId,
          apiKeyId: apiKey.id,
          model: apiKey.model || 'gpt-4o-mini',
          inputTokens,
          outputTokens,
          latencyMs,
        },
      });

      return NextResponse.json({
        role: 'assistant',
        content: responseText,
        model: apiKey.model || 'gpt-4o-mini',
        usage: { inputTokens, outputTokens },
      });

    } else if (apiKey.provider === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey.key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: apiKey.model || 'claude-sonnet-4-20250514',
          max_tokens: 2048,
          system: systemPrompt,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        console.error('Anthropic API error:', res.status, errData);
        return NextResponse.json({
          error: `خطا در ارتباط با Anthropic (${res.status})`,
        }, { status: 502 });
      }

      const data = await res.json();
      responseText = data.content?.[0]?.text ?? 'پاسخی دریافت نشد.';
      const inputTokens = data.usage?.input_tokens ?? 0;
      const outputTokens = data.usage?.output_tokens ?? 0;
      const latencyMs = Date.now() - startTime;

      await db.apiKey.update({
        where: { id: apiKey.id },
        data: {
          totalRequests: { increment: 1 },
          totalTokens: { increment: inputTokens + outputTokens },
          lastUsedAt: new Date(),
        },
      });

      await db.usageLog.create({
        data: {
          userId: user.id as string,
          companyId,
          apiKeyId: apiKey.id,
          model: apiKey.model || 'claude-sonnet-4-20250514',
          inputTokens,
          outputTokens,
          latencyMs,
        },
      });

      return NextResponse.json({
        role: 'assistant',
        content: responseText,
        model: apiKey.model || 'claude-sonnet-4-20250514',
        usage: { inputTokens, outputTokens },
      });

    } else if (apiKey.provider === 'google') {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${apiKey.model || 'gemini-2.0-flash'}:generateContent?key=${apiKey.key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: systemPrompt + '\n\n' + messages.map((m) => `${m.role === 'user' ? 'کاربر' : 'دستیار'}: ${m.content}`).join('\n') }] },
            ],
            generationConfig: { maxOutputTokens: 2048, temperature: 0.7 },
          }),
        },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        console.error('Google API error:', res.status, errData);
        return NextResponse.json({
          error: `خطا در ارتباط با Google AI (${res.status})`,
        }, { status: 502 });
      }

      const data = await res.json();
      responseText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'پاسخی دریافت نشد.';
      const latencyMs = Date.now() - startTime;

      await db.apiKey.update({
        where: { id: apiKey.id },
        data: {
          totalRequests: { increment: 1 },
          lastUsedAt: new Date(),
        },
      });

      await db.usageLog.create({
        data: {
          userId: user.id as string,
          companyId,
          apiKeyId: apiKey.id,
          model: apiKey.model || 'gemini-2.0-flash',
          inputTokens: 0,
          outputTokens: 0,
          latencyMs,
        },
      });

      return NextResponse.json({
        role: 'assistant',
        content: responseText,
        model: apiKey.model || 'gemini-2.0-flash',
      });

    } else {
      return NextResponse.json({
        error: `پروایدر '${apiKey.provider}' پشتیبانی نمی‌شود.`,
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      error: 'خطای داخلی سرور. لطفاً دوباره تلاش کنید.',
    }, { status: 500 });
  }
}
