import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { getPodcastById } from '../services/podcastService';
import { Podcast } from '../types';
import { Button } from '../components/Button';
import { Play, ArrowRight, BookOpen, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
// @ts-ignore
// import newTranscript from '../backend/transcripts/9b9b77c.txt?raw';

export const PodcastDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'transcript'>('overview');

  useEffect(() => {
    if (id) {
      getPodcastById(id)
        .then(setPodcast)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!podcast) {
    return <div className="min-h-screen flex items-center justify-center">Podcast not found</div>;
  }

  return (
    <div className="min-h-screen bg-parchment pt-16">
      <NavBar />

      {/* Podcast Header Info */}
      <div className="bg-seashell px-6 py-12 border-b border-platinum">
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-grey hover:text-deep-space-blue mb-8 transition-colors font-medium">
            <ArrowLeft size={18} />
            Back to Podcasts
          </Link>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src={podcast.imageUrl}
              alt={podcast.title}
              className="w-40 h-40 md:w-52 md:h-52 rounded-xl shadow-md object-cover"
            />
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {podcast.tags && podcast.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 rounded bg-mint-cream text-deep-space-blue text-xs font-medium border border-platinum">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-deep-space-blue mb-2">
                {podcast.title}
              </h1>
              <p className="text-slate-grey font-medium mb-4">Hosted by {podcast.host} • {podcast.date} • {podcast.duration}</p>
              <p className="text-slate-grey max-w-2xl leading-relaxed mb-6">
                {podcast.description}
              </p>
              <div className="w-full">
                {podcast.audioUrl ? (
                  <div className="w-full bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-platinum shadow-sm">
                    <audio controls className="w-full h-10 outline-none" src={podcast.audioUrl}>
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <Button size="lg" className="flex items-center gap-2 rounded-full">
                      <Play size={18} fill="currentColor" /> Play Episode
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-platinum sticky top-16 z-40">
        <div className="max-w-5xl mx-auto px-6 flex items-center gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 font-medium text-sm transition-colors border-b-2 ${activeTab === 'overview' ? 'border-toffee-brown text-deep-space-blue' : 'border-transparent text-slate-grey hover:text-deep-space-blue'}`}
          >
            Shownote
          </button>

          <button
            onClick={() => setActiveTab('transcript')}
            className={`py-4 font-medium text-sm transition-colors border-b-2 ${activeTab === 'transcript' ? 'border-toffee-brown text-deep-space-blue' : 'border-transparent text-slate-grey hover:text-deep-space-blue'}`}
          >
            Transcript
          </button>

          {/* Read & Reflect CTA Tab */}
          <button
            onClick={() => navigate(`/podcast/${id}/reflect`)}
            className="py-4 font-medium text-sm text-toffee-brown hover:text-[#85573D] flex items-center gap-2 group ml-auto md:ml-0"
          >
            <BookOpen size={16} />
            Read & Reflect
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <section>
              <h3 className="text-xl font-bold text-deep-space-blue mb-4">About this Episode</h3>
              {podcast.shownotes ? (
                <div
                  className="text-slate-grey leading-loose prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: podcast.shownotes }}
                />
              ) : (
                <p className="text-slate-grey leading-loose">
                  {podcast.description}
                  <br /><br />
                  (This is a placeholder description. In a real app, this would contain detailed show notes, links, and sponsor information.)
                </p>
              )}
            </section>
          </div>
        )}



        {activeTab === 'transcript' && (
          <div className="animate-fade-in">
            <div className="bg-white p-8 rounded-xl border border-platinum text-deep-space-blue leading-loose font-serif selection:bg-highlight-yellow selection:text-deep-space-blue">
              {/* New Transcript Content */}
              <ReactMarkdown className="prose prose-lg text-deep-space-blue">
                {podcast.fullTranscript || ''}
              </ReactMarkdown>
            </div>
            <div className="mt-8 text-center">
              <p className="text-slate-grey mb-4">Want to highlight and take notes?</p>
              <Button onClick={() => navigate(`/podcast/${id}/reflect`)}>
                Enter Learning Mode
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};