import React, { useEffect, useState } from 'react';
import { NavBar } from '../components/NavBar';
import { getPodcasts } from '../services/podcastService';
import { Podcast } from '../types';
import { Play, Clock, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BrowsePodcasts: React.FC = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPodcasts()
      .then(setPodcasts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment pt-16 flex items-center justify-center">
        <p className="text-deep-space-blue font-serif">Loading library...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment pt-16">
      <NavBar />

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        <h1 className="text-3xl font-serif font-bold text-deep-space-blue mb-10">Featured Podcasts</h1>

        <div className="grid grid-cols-1 gap-6">
          {podcasts.map((podcast) => (
            <Link key={podcast.id} to={`/podcast/${podcast.id}`} className="group block">
              <div className="bg-white border border-platinum rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-shadow">
                <div className="shrink-0">
                  <img
                    src={podcast.imageUrl}
                    alt={podcast.title}
                    className="w-full md:w-32 md:h-32 object-cover rounded-xl group-hover:opacity-90 transition-opacity"
                  />
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <h3 className="text-xl font-bold text-deep-space-blue mb-2 group-hover:text-toffee-brown transition-colors">
                    {podcast.title}
                  </h3>
                  <p className="text-slate-grey mb-4 line-clamp-2">
                    {podcast.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-grey uppercase tracking-wider font-medium">
                    <div className="flex items-center gap-1">
                      <Clock size={14} /> {podcast.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} /> {podcast.date}
                    </div>
                    <span className="text-toffee-brown">{podcast.host}</span>
                  </div>
                </div>
                <div className="hidden md:flex items-center pr-4">
                  <div className="w-10 h-10 rounded-full border border-toffee-brown flex items-center justify-center text-toffee-brown group-hover:bg-toffee-brown group-hover:text-white transition-all">
                    <Play size={18} fill="currentColor" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};