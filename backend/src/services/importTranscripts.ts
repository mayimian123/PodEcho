import fs from 'fs';
import path from 'path';
import db from '../database';

const TRANSCRIPTS_DIR = path.resolve(__dirname, '../../transcripts');

const importTranscripts = () => {
    if (!fs.existsSync(TRANSCRIPTS_DIR)) {
        console.log('Transcripts directory not found.');
        return;
    }

    const files = fs.readdirSync(TRANSCRIPTS_DIR);

    files.forEach(file => {
        if (path.extname(file) === '.txt') {
            const id = path.basename(file, '.txt');
            const content = fs.readFileSync(path.join(TRANSCRIPTS_DIR, file), 'utf-8');

            console.log(`Importing transcript for ID: ${id}...`);

            const stmt = db.prepare('UPDATE podcasts SET transcription = ? WHERE id = ?');
            const result = stmt.run(content, id);

            if (result.changes > 0) {
                console.log(`✅ Updated transcript for ${id}`);
            } else {
                console.log(`⚠️ Podcast ID ${id} not found in database. Transcript not imported.`);
            }
        }
    });
};

if (require.main === module) {
    importTranscripts();
}
