import { Router } from 'express';
import { extractInsight, streamDeepDive, generateSummary } from '../services/deepseek';

const router = Router();

// POST /api/ai/extract
router.post('/extract', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const result = await extractInsight(text);
        res.json({ insight: result });
    } catch (error) {
        // console.error(error); // Already logged in service
        res.status(500).json({ error: 'Failed to extract insight' });
    }
});

// POST /api/ai/deep-dive (Streaming)
router.post('/deep-dive', async (req, res) => {
    const { original_text, history, user_message } = req.body;

    if (!original_text || !user_message) {
        return res.status(400).json({ error: 'Original text and user message are required' });
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const stream = await streamDeepDive(original_text, history || [], user_message);

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                // SSE format: data: <content>\n\n
                // We will send JSON string to make it easier for frontend to parse or just raw text?
                // Standard OpenAI stream returns objects. Let's send raw text chunks for simplicity if frontend expects text,
                // or valid SSE events.
                // Let's assume standard event stream: data: <json>\n\n
                // But to make it super simple for custom frontend: data: <text>\n\n
                res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
            }
        }

        // Signal end
        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        console.error('Stream Error:', error);
        res.write(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`);
        res.end();
    }
});

// POST /api/ai/summary
router.post('/summary', async (req, res) => {
    const { podcast_title, stats, notes } = req.body;

    if (!stats || !notes) {
        return res.status(400).json({ error: 'Stats and notes are required' });
    }

    try {
        const summary = await generateSummary(podcast_title || 'Podcast', stats, notes);
        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate summary' });
    }
});

export default router;
