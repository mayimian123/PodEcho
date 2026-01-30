import React from 'react';
import { Radio, Mic, PenTool, Brain, FileText, ArrowRight, Share2, Box, Database, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans selection:bg-toffee-brown/20 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <div className="relative min-h-[90vh] flex flex-col items-center justify-center">
        {/* Floating Pill Navigation */}
        <div className="absolute top-8 left-0 right-0 flex justify-center z-50">
          <nav className="bg-white/80 backdrop-blur-md border border-white/50 rounded-full px-2 py-2 pl-6 flex items-center gap-8 shadow-sm mx-4">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-toffee-brown" />
              <span className="font-serif font-bold text-lg text-deep-space-blue tracking-tight">PodEcho</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-grey">
              <button className="hover:text-deep-space-blue transition-colors">Listen</button>
              <button className="hover:text-deep-space-blue transition-colors">Reflect</button>
              <button className="hover:text-deep-space-blue transition-colors">Evolve</button>
            </div>

            <button 
              onClick={() => navigate('/browse')}
              className="bg-toffee-brown text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#85573D] transition-colors"
            >
              Get Started
            </button>
          </nav>
        </div>

        {/* Hero Content */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10">
          <div className="mb-8 animate-fade-in-up">
            <span className="text-[11px] font-bold tracking-[0.2em] text-toffee-brown uppercase">
              The Personal Learning Loop
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-deep-space-blue leading-[1.1] mb-8 max-w-5xl animate-fade-in-up delay-100">
            Make podcasts <span className="font-serif italic text-toffee-brown">echo</span>,<br className="hidden md:block"/>
            not just pass through.
          </h1>

          <p className="text-lg md:text-xl text-slate-grey font-light max-w-2xl leading-relaxed mb-10 animate-fade-in-up delay-200">
            Podcasts flow like water—easy to consume, hard to hold. PodEcho turns that stream into a reservoir of knowledge through listening, reflecting, and evolving.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-4 animate-fade-in-up delay-300">
            <button 
              onClick={() => navigate('/browse')}
              className="bg-deep-space-blue text-white text-base font-medium px-8 py-3.5 rounded-full hover:bg-slate-800 transition-all hover:scale-105 shadow-lg shadow-deep-space-blue/10"
            >
              Start Your Loop
            </button>
            <button className="bg-transparent border border-platinum text-deep-space-blue text-base font-medium px-8 py-3.5 rounded-full hover:bg-white hover:border-slate-300 transition-all">
              How it works
            </button>
          </div>
        </main>

        {/* Wave Animation */}
        <div className="absolute bottom-0 left-0 right-0 w-full h-[35vh] pointer-events-none z-0 opacity-60">
          <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full preserve-3d" preserveAspectRatio="none">
            <style>
              {`
                @keyframes flow {
                  0% { transform: translateX(0); }
                  50% { transform: translateX(-20px); }
                  100% { transform: translateX(0); }
                }
                .wave-1 { animation: flow 8s ease-in-out infinite; }
                .wave-2 { animation: flow 12s ease-in-out infinite reverse; }
                .wave-3 { animation: flow 10s ease-in-out infinite; }
              `}
            </style>
            <path fill="none" stroke="#996548" strokeWidth="1" strokeOpacity="0.2" className="wave-1" d="M0,160 C320,180 480,240 720,240 C960,240 1120,180 1440,160"/>
            <path fill="none" stroke="#1E293B" strokeWidth="0.8" strokeOpacity="0.15" className="wave-2" d="M0,190 C360,220 520,140 840,140 C1160,140 1280,220 1440,190"/>
            <path fill="none" stroke="#996548" strokeWidth="0.5" strokeOpacity="0.3" className="wave-3" d="M0,220 C240,260 600,100 960,100 C1320,100 1380,260 1440,220"/>
          </svg>
        </div>
        
        <div className="absolute bottom-6 w-full text-center z-10">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-grey/40 uppercase">
            Explore The Loop
          </span>
        </div>
      </div>

      {/* --- ILLUSION OF LEARNING --- */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-deep-space-blue text-center mb-16">
            The Illusion of Learning
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              { id: '01', title: "Passive Consumption", desc: "You listen to 10 hours a week, but struggle to recall three key takeaways by Friday." },
              { id: '02', title: "Isolated Bookmarks", desc: "Screenshots and saved timestamps pile up in a digital graveyard, never to be reviewed again." },
              { id: '03', title: "Zero Synthesis", desc: "Information flows through you without connecting to your existing mental models or life experience." }
            ].map((item) => (
              <div key={item.id} className="bg-white p-10 rounded-3xl border border-platinum shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="text-6xl font-serif text-platinum font-bold mb-6 opacity-80">{item.id}</div>
                <h3 className="text-xl font-bold text-deep-space-blue mb-4">{item.title}</h3>
                <p className="text-slate-grey leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <p className="font-serif text-2xl md:text-3xl text-toffee-brown italic leading-relaxed">
              "Information is not knowledge. The only source of knowledge is experience and reflection."
            </p>
          </div>
        </div>
      </section>

      {/* --- ECOSYSTEM GRID --- */}
      <section className="py-24 px-6 bg-[#FCFCFC] border-y border-platinum">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-deep-space-blue mb-4">
              Listen. Reflect. <span className="text-toffee-brown">Evolve.</span>
            </h2>
            <p className="text-slate-grey text-lg max-w-2xl mx-auto">
              A complete ecosystem designed to move you from content consumption to knowledge creation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Mic, color: "bg-orange-100", title: "Content Hub", desc: "Import your favorite episodes or browse our curated library of high-signal podcasts." },
              { icon: PenTool, color: "bg-blue-100", title: "Read & Reflect", desc: "Interactive transcripts meet active note-taking. Highlight, annotate, and extract key points instantly." },
              { icon: Brain, color: "bg-purple-100", title: "Deep Dive AI", desc: "Socratic dialogue agent that challenges your understanding and forces deep cognitive processing." },
              { icon: FileText, color: "bg-green-100", title: "Insight Assets", desc: "Turn scattered thoughts into beautiful, shareable insight summaries and learning reports." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-platinum hover:border-toffee-brown/30 transition-colors h-full">
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-6 text-deep-space-blue`}>
                  <item.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-deep-space-blue mb-3">{item.title}</h3>
                <p className="text-slate-grey text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- LISTEN & CAPTURE --- */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-16 h-16 bg-mint-cream rounded-2xl flex items-center justify-center mb-8 text-toffee-brown">
              <Mic size={32} strokeWidth={1.5} />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-deep-space-blue mb-8">
              Listen <span className="italic">&</span> Capture
            </h2>
            <p className="text-xl text-slate-grey leading-relaxed mb-8">
              Most podcasts are passive. You hear a brilliant idea, nod, and five minutes later... it's gone.
            </p>
            <p className="text-lg text-deep-space-blue font-medium leading-relaxed mb-8">
              PodEcho changes the mode. <span className="text-slate-grey font-normal">Interactive marking lets you snatch ideas from the air as you listen. It's not just audio anymore; it's raw material.</span>
            </p>
            <ul className="space-y-4">
              {['Real-time annotation', 'Smart timestamps', 'Voice-to-text highlight'].map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-deep-space-blue font-medium">
                  <span className="w-2 h-2 rounded-full bg-toffee-brown"></span>
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="bg-white p-8 rounded-[32px] shadow-2xl border border-platinum relative z-10 min-h-[320px] flex flex-col">
              <div className="flex justify-between items-center mb-12">
                <span className="text-xs font-bold tracking-widest text-slate-grey uppercase">Now Playing</span>
                <span className="text-xs font-medium text-red-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  Recording Thoughts
                </span>
              </div>
              
              {/* Removed Audio Visualizer Animation */}

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs">
                 {/* Floating Card */}
                 <div className="bg-mint-cream border border-toffee-brown/20 p-4 rounded-xl shadow-lg relative transform transition-transform hover:-translate-y-1">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-toffee-brown rounded-full flex items-center justify-center text-white text-[10px]">
                      <PenTool size={12} />
                    </div>
                    <p className="font-serif italic text-deep-space-blue text-sm text-center">
                      "This concept of 'anti-fragility' is exactly what I needed for the project..."
                    </p>
                 </div>
              </div>
            </div>
            {/* Decorative bg blur */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-toffee-brown/10 to-transparent rounded-[40px] -z-10 blur-xl"></div>
          </div>
        </div>
      </section>

      {/* --- REFLECT & ECHO --- */}
      <section className="py-32 px-6 bg-seashell/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-platinum mb-8">
            <ArrowRight size={14} className="text-toffee-brown" />
            <span className="text-xs font-bold tracking-wider text-toffee-brown uppercase">The Feynman Technique</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-serif text-deep-space-blue mb-6">
            Reflect <span className="italic font-light">&</span> Echo
          </h2>
          
          <p className="text-slate-grey text-lg max-w-2xl mx-auto mb-20 leading-relaxed">
            Information only becomes knowledge when you translate it into your own language. 
            Engage in a deep, Socratic dialogue with your captured insights to internalize them.
          </p>

          <div className="relative max-w-xl mx-auto">
             {/* Connector Line */}
             <div className="absolute left-1/2 top-0 bottom-0 w-px bg-toffee-brown/20 -z-10 transform -translate-x-1/2"></div>
             
             {/* Top Card */}
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-platinum text-left mb-8 relative">
               <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold tracking-widest text-slate-grey uppercase">Raw Insight</span>
                  <div className="w-2 h-2 rounded-full bg-platinum"></div>
               </div>
               <p className="font-serif text-xl text-deep-space-blue italic">
                 "Confusion is the beginning of understanding."
               </p>
             </div>

             {/* Middle Icon */}
             <div className="w-12 h-12 bg-white rounded-full border-4 border-seashell flex items-center justify-center mx-auto my-8 text-toffee-brown shadow-sm relative z-10">
                <Brain size={20} className="animate-pulse-slow" />
             </div>

             {/* Bottom Card */}
             <div className="bg-deep-space-blue p-8 rounded-2xl shadow-xl text-left relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-bold tracking-widest text-toffee-brown uppercase">Internalized Wisdom</span>
                  <div className="w-2 h-2 rounded-full bg-toffee-brown"></div>
               </div>
               <p className="text-white/90 leading-relaxed font-medium">
                 "I shouldn't fear not knowing things. When I'm confused, it means I'm about to upgrade my mental model. It's a signal to dig deeper, not retreat."
               </p>
               {/* Decorative glow */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-toffee-brown/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
             </div>
          </div>
        </div>
      </section>

      {/* --- EVOLVE YOUR MIND --- */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-deep-space-blue mb-6">
            Evolve Your Mind
          </h2>
          <p className="text-slate-grey text-lg max-w-2xl mx-auto mb-16 leading-relaxed">
            Stop letting insights evaporate. Build a compounding library of personal thoughts that grows with you.
          </p>

          <div className="relative bg-white border border-platinum rounded-2xl p-4 md:p-8 shadow-2xl overflow-hidden group">
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-100 border border-red-200"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-200"></div>
              <div className="w-3 h-3 rounded-full bg-green-100 border border-green-200"></div>
            </div>
            
            <div className="absolute top-4 right-4 bg-platinum/50 px-2 py-1 rounded text-[10px] font-mono text-slate-grey">
              knowledge_graph.v2
            </div>

            {/* Mock Graph UI */}
            <div className="aspect-[16/9] bg-slate-50 rounded-xl mt-8 relative flex items-center justify-center overflow-hidden border border-platinum/50">
               {/* Grid Pattern */}
               <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.3}}></div>
               
               {/* Nodes */}
               <div className="absolute inset-0">
                  {/* Central Node */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 bg-deep-space-blue rounded-2xl flex items-center justify-center shadow-lg text-white z-10 relative">
                      <Database size={24} />
                    </div>
                    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-deep-space-blue tracking-widest uppercase">My Core</span>
                  </div>

                  {/* Removed Mental Models Node */}

                  <div className="absolute bottom-1/3 right-1/3">
                     <div className="w-10 h-10 bg-white border border-platinum rounded-xl flex items-center justify-center shadow-sm text-slate-grey">
                        <Share2 size={16} />
                     </div>
                     <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[9px] text-slate-grey uppercase whitespace-nowrap">Connections</span>
                  </div>
                  
                  {/* Connections (SVG Lines) */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10">
                    {/* Removed connection line for Mental Models */}
                    <line x1="50%" y1="50%" x2="65%" y2="65%" stroke="#CBD5E1" strokeWidth="2" />
                    <line x1="50%" y1="50%" x2="70%" y2="30%" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 4" />
                  </svg>
               </div>
               
               {/* Floating CTA */}
               <button className="absolute bottom-8 bg-white/90 backdrop-blur border border-platinum px-6 py-3 rounded-full shadow-lg flex items-center gap-2 text-deep-space-blue text-sm font-bold hover:scale-105 transition-transform">
                 Explore Graph View <ArrowUpRight size={14} />
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-platinum py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Radio className="w-6 h-6 text-toffee-brown" />
          <span className="font-serif font-bold text-xl text-deep-space-blue">PodEcho</span>
        </div>
        <div className="flex justify-center gap-8 text-sm text-slate-grey font-medium mb-8">
          <button className="hover:text-deep-space-blue">Privacy</button>
          <button className="hover:text-deep-space-blue">Terms</button>
          <button className="hover:text-deep-space-blue">Twitter</button>
        </div>
        <p className="text-slate-grey/50 text-xs tracking-wider uppercase">© 2026 PodEcho Inc. All rights reserved.</p>
      </footer>

    </div>
  );
};