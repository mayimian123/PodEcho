import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

// Initialize OpenAI client pointing to DeepSeek API
const openai = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com'
});

const MODEL = 'deepseek-chat';

export const extractInsight = async (text: string): Promise<string> => {
    try {
        const response = await openai.chat.completions.create({
            model: MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert editor. Your task is to extract the core insight from the given text. Remove filler words, keep it concise (1-2 sentences), and do not add any intro/outro.'
                },
                {
                    role: 'user',
                    content: text
                }
            ],
            temperature: 0.3,
        });

        return response.choices[0].message.content || 'Could not extract insight.';
    } catch (error) {
        console.error('DeepSeek Extract Error:', error);
        throw error;
    }
};

export const streamDeepDive = async (
    originalText: string,
    history: { role: 'user' | 'assistant'; content: string }[],
    userMessage: string
) => {
    try {
        const systemPrompt = `
You are a gentle, thoughtful companion helping the user explore a podcast quote they've highlighted: "${originalText}"

## Your Role
Companion, not teacher. You're here to think alongside them, not guide them to predetermined answers.

## Core Principles

**Be Gentle**
- Give space. Don't interrogate with constant questions.
- When they answer briefly or hesitate, don't pressure—share your thoughts instead.

**Be Insightful**
- Help them see what they might not have noticed.
- Turn vague feelings into clear thoughts.
- Share observations, not lectures.

**Be Genuine**
- Understand their feelings sincerely.
- Share your reflections naturally, not performatively.

**Vary Your Rhythm**
- ~50% of responses: Share insight + ask one open question
- ~50% of responses: Share insight + pause (no question)
- Never ask multiple questions in one response

## Response Patterns

**Opening (1-2 turns)**
Start gently: "What about this quote resonated with you?"

**Middle (3-6 turns)**
When they share feelings:
- First empathize: "I understand..." or "I've felt that too..."
- Then offer insight: "I wonder if this is really about..."
- Sometimes ask: "Does that resonate?" 
- Sometimes just pause, letting them digest

When they answer briefly:
- Don't chase. Share what you're thinking: "This makes me think..."
- Then stop, giving them room to respond

When they ask "what do you think?":
- Share honestly: "If it were me, I'd say..."
- Gently return: "Does this feel right to you?"

**Closing (7-10 turns)**
When they reach an insight, affirm it briefly and help clarify.

## Style Guide

**Say this:**
- "I've felt that too..."
- "This makes me think..."
- "Maybe it's less about X and more about Y..."
- "I'm curious—[question]?" (not "I want to ask...")

**Don't say:**
- "So, what do you think..." (too formal)
- "Great! Next question..." (too teacherly)
- Multiple questions in a row (too aggressive)

**Keep it:**
- 80-120 words per response
- Conversational and warm
- One question maximum (if you ask at all)

## When User Clicks "Save"
Summarize their key insights in 100-150 words:
- Focus on their growth and thinking
- Be specific, warm, and affirming
- Highlight actionable takeaways

---

**Remember:** You're thinking together, not teaching. Share your reflections, give them space, and trust the conversation to unfold naturally.
    `;

        // Construct messages: System -> History -> User
        const messages: any[] = [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: userMessage }
        ];

        const stream = await openai.chat.completions.create({
            model: MODEL,
            messages: messages,
            stream: true,
            temperature: 0.7,
        });

        return stream;
    } catch (error) {
        console.error('DeepSeek Stream Error:', error);
        throw error;
    }
};

export const generateSummary = async (
    podcastTitle: string,
    stats: { highlight_count: number; extract_count: number; deep_dive_count: number },
    notes: any[],
    shownotes: string
): Promise<any> => {
    try {
        const prompt = `
Please generate a learning summary for the podcast "${podcastTitle}".

Podcast Shownotes:
${shownotes}

User Stats:
- Highlights: ${stats.highlight_count}
- Extracts: ${stats.extract_count}
- Deep Dives: ${stats.deep_dive_count}

All Notes (Highlights, Extracts, Deep Dive Summaries):
${JSON.stringify(notes, null, 2)}

Please generate a warm, encouraging summary (JSON format) with:
1. **core_insights** (2-3 sentences): What touched the user most? Connect their notes to the podcast themes.
2. **personal_growth** (3 points, 15-25 words each): New thinking/connections.
3. **actionable_tips** (1-2 points, 20-30 words each): Specific actions.

Tone: Warm, "You" focused.
Output strictly valid JSON.
    `;

        const response = await openai.chat.completions.create({
            model: MODEL,
            messages: [
                { role: 'system', content: 'You are a helpful learning assistant. Output JSON only.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.5,
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error('No content generated');

        return JSON.parse(content);
    } catch (error) {
        console.error('DeepSeek Summary Error:', error);
        throw error;
    }
};

export const summarizeChat = async (
    originalText: string,
    chatHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> => {
    try {
        const conversationText = chatHistory
            .map(msg => `${msg.role.toUpperCase()}: ${msg.content} `)
            .join('\n');

        const prompt = `
You are an expert learning assistant. 
The user had a deep - dive discussion about this specific quote from a podcast:
        "${originalText}"

Here is the conversation history:
${conversationText}

Please generate a concise summary(1 - 2 sentences) of the key insight or conclusion the user reached during this discussion. 
Focus on the user's takeaways. Do not just describe the conversation ("The user and assistant discussed..."), but state the insight directly.
            `;

        const response = await openai.chat.completions.create({
            model: MODEL,
            messages: [
                { role: 'system', content: 'You are a helpful assistant. Output text only.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.5,
        });

        return response.choices[0].message.content || 'Discussion saved.';
    } catch (error) {
        console.error('DeepSeek Chat Summary Error:', error);
        return 'Discussion saved (Summary failed).';
    }
};
