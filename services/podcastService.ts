import { Podcast } from '../types';

const API_BASE = 'http://localhost:3000/api';

export const getPodcasts = async (): Promise<Podcast[]> => {
    const res = await fetch(`${API_BASE}/podcasts`);
    if (!res.ok) throw new Error('Failed to fetch podcasts');
    return res.json();
};

export const getPodcastById = async (id: string): Promise<Podcast> => {
    const res = await fetch(`${API_BASE}/podcasts/${id}`);
    if (!res.ok) throw new Error('Failed to fetch podcast');
    return res.json();
};
