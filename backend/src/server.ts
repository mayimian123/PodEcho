import express from 'express';
import cors from 'cors';
import path from 'path';
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

// Calculate the path to the frontend build directory
// Assuming structure: root/backend/src/server.ts -> root/dist
const distPath = path.join(__dirname, '../../dist');

// Serve static files from the React frontend app
app.use(express.static(distPath));

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

// Health check endpoint (optional, can be under /api/health)
app.get('/api/health', (req, res) => {
    res.send('PodEcho Backend is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
