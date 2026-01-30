import React from 'react';
import { NavBar } from '../components/NavBar';
import { PODCASTS } from '../constants';
import { Play, Ear, Brain, TrendingUp, Clock, Calendar, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col pt-16">
      <NavBar />
      
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-6 py-20 lg:py-32 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-deep-space-blue mb-4 leading-tight">
          Make podcasts echo,<br /> not just pass through
        </h1>
        <p className="text-xl md:text-2xl text-slate-grey font-light mb-12">
          让播客在你脑海里回响，而不只是路过
        </p>

        {/* 3 Step Philosophy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
          {[
            { icon: Ear, title: "Listen", desc: "Active listening with instant highlighting." },
            { icon: Brain, title: "Reflect", desc: "Socratic dialogue to internalize wisdom." },
            { icon: TrendingUp, title: "Evolve", desc: "Build a library of deep thoughts." },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border-b-4 border-toffee-brown shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-mint-cream rounded-full flex items-center justify-center mx-auto mb-4 text-toffee-brown">
                <item.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-deep-space-blue mb-2">{item.title}</h3>
              <p className="text-slate-grey text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <Button size="lg" onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth'})}>
          Start Exploring
        </Button>
      </section>

      {/* Featured Podcasts */}
      <section id="featured" className="bg-white py-20 px-6 lg:px-12 border-t border-platinum">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-deep-space-blue mb-10">Featured Podcasts</h2>
          
          <div className="grid grid-cols-1 gap-6">
            {PODCASTS.map((podcast) => (
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
      </section>

      {/* Footer */}
      <footer className="bg-parchment py-10 text-center border-t border-platinum">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-70">
          <Radio className="w-5 h-5" />
          <span className="font-serif font-bold text-deep-space-blue">PodEcho</span>
        </div>
        <p className="text-slate-grey text-sm">© 2026 PodEcho. Make it stick.</p>
      </footer>
    </div>
  );
};