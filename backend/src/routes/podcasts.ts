import { Router } from 'express';
import db from '../database';
import fs from 'fs';
import path from 'path';

const router = Router();
const TRANSCRIPTS_DIR = path.join(__dirname, '../../transcripts');

// GET /api/podcasts - List all podcasts
router.get('/', (req, res) => {
    try {
        const podcasts = db.prepare(`
      SELECT id, title, description, cover_image, duration, host, created_at, audio_url 
      FROM podcasts 
      ORDER BY created_at DESC
    `).all();

        const formatted = podcasts.map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            imageUrl: p.cover_image,
            duration: p.duration,
            date: p.created_at,
            host: p.host || "Unknown Host",
            audioUrl: p.audio_url
        }));

        res.json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch podcasts' });
    }
});

// GET /api/podcasts/:id - Get details with transcript
router.get('/:id', (req, res) => {
    try {
        const podcast = db.prepare(`
      SELECT id, title, description, host, cover_image, duration, transcription, source_url, created_at, audio_url, shownotes 
      FROM podcasts 
      WHERE id = ?
    `).get(req.params.id) as any;

        if (!podcast) {
            return res.status(404).json({ error: 'Podcast not found' });
        }

        // Try to read from local file first
        let fullTranscript = podcast.transcription;
        const filePath = path.join(TRANSCRIPTS_DIR, `${podcast.id}.txt`);

        if (fs.existsSync(filePath)) {
            try {
                fullTranscript = fs.readFileSync(filePath, 'utf-8');
            } catch (err) {
                console.warn(`Failed to read transcript file for ${podcast.id}`, err);
            }
        }

        const formatted = {
            id: podcast.id,
            title: podcast.title,
            description: podcast.description,
            imageUrl: podcast.cover_image,
            duration: podcast.duration,
            date: podcast.created_at,
            host: podcast.host || "Unknown Host",
            fullTranscript: fullTranscript,
            sourceUrl: podcast.source_url,
            audioUrl: podcast.audio_url,
            shownotes: podcast.shownotes
        };

        res.json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch podcast details' });
    }
});

export default router;
