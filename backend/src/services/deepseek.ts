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
You are a Socratic learning coach. The user is learning from a podcast and has highlighted this text:
"${originalText}"

Your task is to:
1. Deepen their understanding through follow-up questions.
2. Connect to their personal experience.
3. Help them apply the knowledge.

Guidelines:
- Do not lecture; ask guiding questions.
- Ask one specific question at a time.
- Based on the user's answer, dig deeper.
- Be warm and encouraging.
- When the user gains an insight, summarize it briefly.

Keep your responses concise and conversational (under 150 words).
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
    notes: any[]
): Promise<any> => {
    try {
        const prompt = `
Please generate a learning summary for the podcast "${podcastTitle}".

User Stats:
- Highlights: ${stats.highlight_count}
- Extracts: ${stats.extract_count}
- Deep Dives: ${stats.deep_dive_count}

All Notes:
${JSON.stringify(notes, null, 2)}

Please generate a warm, encouraging summary (JSON format) with:
1. **core_insights** (2-3 sentences): What touched the user most?
2. **personal_growth** (3 points, 15-25 words each): New thinking/connections.
3. **actionable_tips** (1-2 points, 20-30 words each): Specific actions.

Tone: Warm, "You" focused.
Output strictly valid JSON.
    `;

        const response = await openai.chat.completions.create({
            model: MODEL, // Or deepseek-reasoner if available/needed for complex logic, but chat is fine
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
