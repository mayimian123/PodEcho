import express from 'express';
import cors from 'cors';
import { initDb } from './database';
import podcastRoutes from './routes/podcasts';
import aiRoutes from './routes/ai';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize DB (ensure tables exist)
initDb();

// Routes
app.use('/api/podcasts', podcastRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('PodEcho Backend is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
