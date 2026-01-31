import puppeteer from 'puppeteer';
import db from '../database';

const PODCAST_URLS = [
    'https://www.bestblogs.dev/en/podcast/1c6b75e',
    'https://www.bestblogs.dev/en/podcast/5c6b5ce',
    'https://www.bestblogs.dev/en/podcast/c916d1d',
    'https://www.bestblogs.dev/en/podcast/5c860ad',
    'https://www.bestblogs.dev/en/podcast/03901ed',
    'https://www.bestblogs.dev/en/podcast/67a4aa2',
    'https://www.bestblogs.dev/en/podcast/feb3190',
    'https://www.bestblogs.dev/en/podcast/dae92c0',
    'https://www.bestblogs.dev/en/podcast/9b9b77c',
    'https://www.bestblogs.dev/en/podcast/1c6b75e'
];

const getIdFromUrl = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
};

export const scrapePodcast = async (url: string) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        console.log(`Scraping ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

        // Wait for potential content
        try {
            await page.waitForSelector('#bbArticleContent', { timeout: 3000 });
        } catch (e) {
            console.log("Warining: #bbArticleContent selector timed out");
        }

        const data = await page.evaluate(() => {
            const title = document.querySelector('h1')?.innerText?.trim() || '';
            let description = document.querySelector('meta[name="description"]')?.getAttribute('content') ||
                document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';

            // User requested to prioritize the img tag with alt="Podcast cover"
            let cover_image = '';
            const imgEl = document.querySelector('img[alt="Podcast cover"]');
            if (imgEl) {
                cover_image = (imgEl as HTMLImageElement).src;
            }

            // Fallback to og:image if not found
            if (!cover_image || cover_image.trim() === '') {
                cover_image = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
            }

            // Host / Program Name Selector
            let host = 'Unknown Host';
            const hostEl = document.querySelector('a[href*="/podcasts?sourceid="]');
            if (hostEl && hostEl.textContent) {
                host = hostEl.textContent.trim();
            }

            // Shownotes Selector
            let shownotes = '';
            const contentEl = document.querySelector('#bbArticleContent');
            if (contentEl) {
                shownotes = contentEl.innerHTML;
            } else {
                // Try looking for article content if class is different
                const article = document.querySelector('article');
                if (article) shownotes = article.innerHTML;
            }

            const allText = document.body.innerText;
            let duration = 'Unknown';
            const durationMatch = allText.match(/(\d{1,2}\s*:\s*\d{2}\s*:\s*\d{2})/) || allText.match(/(\d{1,2}h\s*\d{1,2}m)/);
            if (durationMatch) {
                duration = durationMatch[0];
            }

            let transcription = '';
            const potentiallyTranscript = Array.from(document.querySelectorAll('div, article, section'));
            let bestCandidate = null;
            let maxPCount = 0;

            for (const el of potentiallyTranscript) {
                const pCount = el.querySelectorAll('p').length;
                if (pCount > maxPCount && (el as HTMLElement).innerText.length > 500) {
                    maxPCount = pCount;
                    bestCandidate = el;
                }
            }

            if (bestCandidate) {
                transcription = (bestCandidate as HTMLElement).innerText;
            } else {
                transcription = Array.from(document.querySelectorAll('p'))
                    .map(p => p.innerText)
                    .join('\n\n');
            }

            transcription = transcription
                .replace(/BestBlogs\.dev/g, '')
                .replace(/Summary/g, '')
                .trim();

            return {
                title,
                description,
                host,
                cover_image,
                shownotes,
                duration,
                transcription
            };
        });

        if (!data.title) {
            console.warn(`Warning: No title found for ${url}`);
        }
        if (data.transcription.length < 100) {
            console.warn(`Warning: Transcript too short for ${url}`);
        }

        const id = getIdFromUrl(url);

        // Fetch audio URL from API
        let audioUrl = '';
        try {
            const apiUrl = `https://api.bestblogs.dev/api/resource/detail?id=${id}&language=en`;
            console.log(`Fetching API details for ${id}...`);
            const response = await fetch(apiUrl);
            if (response.ok) {
                const json = await response.json() as any;
                if (json.data && json.data.metaData && json.data.metaData.enclosureUrl) {
                    audioUrl = json.data.metaData.enclosureUrl;
                    console.log(`Found audio URL for ${id}`);
                }
            }
        } catch (error) {
            console.error(`Failed to fetch API details for ${id}:`, error);
        }

        // Ensure columns exist
        try { db.prepare('ALTER TABLE podcasts ADD COLUMN host TEXT').run(); } catch (e) { }
        try { db.prepare('ALTER TABLE podcasts ADD COLUMN audio_url TEXT').run(); } catch (e) { }
        try { db.prepare('ALTER TABLE podcasts ADD COLUMN shownotes TEXT').run(); } catch (e) { }


        const insert = db.prepare(`
      INSERT OR REPLACE INTO podcasts (id, title, description, host, cover_image, shownotes, duration, transcription, source_url, audio_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        insert.run(
            id,
            data.title,
            data.description,
            data.host,
            data.cover_image,
            data.shownotes,
            data.duration,
            data.transcription,
            url,
            audioUrl
        );

        console.log(`Saved "${data.title}" (Transcript len: ${data.transcription.length})`);

    } catch (error) {
        console.error(`Failed to scrape ${url}:`, error);
    } finally {
        await browser.close();
    }
};

export const runScraper = async () => {
    const { initDb } = require('../database');
    initDb();

    for (const url of PODCAST_URLS) {
        await scrapePodcast(url);
    }
    console.log("Scraping complete!");
};

if (require.main === module) {
    runScraper();
}
