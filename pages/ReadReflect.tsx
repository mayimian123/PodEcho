import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PODCASTS } from '../constants';
import { Note, NoteType, ChatMessage } from '../types';
import { extractInsight, chatWithContext } from '../services/geminiService';
import { generateReportHTML } from '../services/reportGenerator';
import { Button } from '../components/Button';
import { ArrowLeft, Download, Highlighter, Sparkles, MessageSquare, Trash2, Edit2, X, Send, Save, ArrowUp, ChevronRight, FileCode, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const ReadReflect: React.FC = () => {
  const { id } = useParams();
  const podcast = PODCASTS.find(p => p.id === id);
  
  // State
  const [notes, setNotes] = useState<Note[]>([]);
  const [sidebarMode, setSidebarMode] = useState<'notes' | 'chat'>('notes');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chatContext, setChatContext] = useState<string>(''); 
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  
  // Selection Popover State
  const [selectionRange, setSelectionRange] = useState<Range | null>(null);
  const [popoverPos, setPopoverPos] = useState<{top: number, left: number} | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- Selection Logic ---
  
  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    
    // Validate selection
    if (!selection || selection.isCollapsed || !transcriptRef.current?.contains(selection.anchorNode)) {
      setPopoverPos(null);
      setSelectionRange(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    // Calculate position for popover (centered above selection)
    setPopoverPos({
      top: rect.top + scrollTop - 50, // 50px above
      left: rect.left + (rect.width / 2),
    });
    setSelectionRange(range);
  }, []);

  // --- Action Handlers ---

  const createNote = async (type: NoteType) => {
    if (!selectionRange) return;
    
    const text = selectionRange.toString();
    const newNoteId = Date.now().toString();
    
    // Clear selection UI
    window.getSelection()?.removeAllRanges();
    setPopoverPos(null);
    setSelectionRange(null);

    // Initial Note Creation
    const baseNote: Note = {
      id: newNoteId,
      type,
      originalText: text,
      timestamp: Date.now(),
    };

    if (type === NoteType.HIGHLIGHT) {
      setNotes(prev => [baseNote, ...prev]);
    } else if (type === NoteType.EXTRACT) {
      // Add placeholder note while AI works
      const tempNote = { ...baseNote, content: "Extracting insight..." };
      setNotes(prev => [tempNote, ...prev]);
      
      // Call AI
      const insight = await extractInsight(text);
      
      // Update note
      setNotes(prev => prev.map(n => n.id === newNoteId ? { ...n, content: insight } : n));
    } else if (type === NoteType.DEEP_DIVE) {
      // Switch to chat mode
      setChatContext(text);
      setChatHistory([
        { id: 'system-start', role: 'model', text: `Hi! I see you're interested in this quote: "${text.substring(0, 50)}...". What are your thoughts on it?` }
      ]);
      setSidebarMode('chat');
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || isAiThinking) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAiThinking(true);

    const responseText = await chatWithContext(
      chatHistory.map(m => ({ role: m.role, text: m.text })),
      chatContext,
      userMsg.text
    );

    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
    setChatHistory(prev => [...prev, aiMsg]);
    setIsAiThinking(false);
  };
  
  const saveDeepDive = async () => {
    // Save conversation as a note
    const summary = "Chat Session saved. (AI Summary would appear here in full version)";
    const newNote: Note = {
      id: Date.now().toString(),
      type: NoteType.DEEP_DIVE,
      originalText: chatContext,
      content: summary + "\n\nLast thought: " + chatHistory[chatHistory.length - 1].text,
      timestamp: Date.now(),
    };
    setNotes(prev => [newNote, ...prev]);
    setSidebarMode('notes');
    setChatHistory([]);
    setChatContext('');
  };

  const handleExportHTML = () => {
    if (!podcast) return;
    const htmlContent = generateReportHTML(podcast, notes);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `podecho-report-${podcast.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExportMenuOpen(false);
  };

  const handleExportPDF = () => {
    if (!podcast) return;
    const htmlContent = generateReportHTML(podcast, notes);
    
    // Open in new window and trigger print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      // Allow images/styles to load then print
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        // Optional: printWindow.close();
      }, 500);
    }
    setIsExportMenuOpen(false);
  };

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isAiThinking]);

  if (!podcast) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white" onMouseUp={handleSelection}>
      
      {/* Top Nav */}
      <header className="h-16 flex-none bg-white border-b border-platinum flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-4">
          <Link to={`/podcast/${id}`} className="flex items-center gap-2 text-toffee-brown font-medium hover:opacity-80 transition-opacity">
            <ArrowLeft size={18} />
            Back to Podcast
          </Link>
          <div className="h-6 w-px bg-platinum mx-2"></div>
          <span className="text-slate-grey text-sm truncate max-w-md">{podcast.title}</span>
        </div>
        
        <div className="hidden md:flex relative">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)} 
            className="flex gap-2"
          >
            <Download size={16} /> Export Report
          </Button>

          {isExportMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-platinum overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
              <button 
                onClick={handleExportHTML}
                className="w-full text-left px-4 py-3 text-sm text-deep-space-blue hover:bg-parchment flex items-center gap-2"
              >
                <FileCode size={16} className="text-toffee-brown" />
                Export HTML
              </button>
              <button 
                onClick={handleExportPDF}
                className="w-full text-left px-4 py-3 text-sm text-deep-space-blue hover:bg-parchment flex items-center gap-2 border-t border-platinum"
              >
                <FileText size={16} className="text-toffee-brown" />
                Export PDF
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Split */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Transcript Area (65%) */}
        <div className="w-[65%] overflow-y-auto bg-white p-12 relative" >
          <div className="max-w-2xl mx-auto pb-24" ref={transcriptRef}>
            <h2 className="text-3xl font-serif font-bold text-deep-space-blue mb-8">Read and Reflect</h2>
            <div className="prose prose-lg text-deep-space-blue leading-relaxed font-serif selection:bg-highlight-yellow selection:text-deep-space-blue">
               <ReactMarkdown>{podcast.fullTranscript}</ReactMarkdown>
            </div>
          </div>

          {/* Floating Action Menu */}
          {popoverPos && (
            <div 
              className="fixed z-50 bg-white rounded-lg shadow-xl border border-platinum flex items-center divide-x divide-platinum transform -translate-x-1/2 animate-in fade-in zoom-in duration-200"
              style={{ top: popoverPos.top, left: popoverPos.left }}
              onMouseDown={(e) => e.stopPropagation()} // Prevent clearing selection when clicking buttons
            >
              <button onClick={() => createNote(NoteType.HIGHLIGHT)} className="flex items-center gap-2 px-4 py-2 hover:bg-parchment text-slate-grey hover:text-toffee-brown transition-colors">
                <Highlighter size={16} />
                <span className="text-xs font-semibold">Highlight</span>
              </button>
              <button onClick={() => createNote(NoteType.EXTRACT)} className="flex items-center gap-2 px-4 py-2 hover:bg-parchment text-slate-grey hover:text-toffee-brown transition-colors">
                <Sparkles size={16} />
                <span className="text-xs font-semibold">Extract</span>
              </button>
              <button onClick={() => createNote(NoteType.DEEP_DIVE)} className="flex items-center gap-2 px-4 py-2 hover:bg-parchment text-slate-grey hover:text-toffee-brown transition-colors">
                <MessageSquare size={16} />
                <span className="text-xs font-semibold">Deep Dive</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Sidebar (35%) */}
        <div className="w-[35%] bg-mint-cream border-l border-platinum flex flex-col relative shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.02)]">
          
          {/* Sidebar Mode: NOTES */}
          {sidebarMode === 'notes' && (
            <>
              <div className="flex-none p-6 border-b border-platinum/50 flex justify-between items-baseline">
                <h3 className="text-lg font-bold text-deep-space-blue">Your Notes</h3>
                <span className="text-xs text-slate-grey font-medium">{notes.length} notes</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {notes.length === 0 ? (
                  <div className="text-center mt-20 text-slate-grey">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-platinum">
                        <Highlighter size={32} />
                     </div>
                     <p className="font-medium">No notes yet</p>
                     <p className="text-sm mt-2 opacity-75">Select text in the transcript to start highlighting.</p>
                  </div>
                ) : (
                  notes.map(note => (
                    <div key={note.id} className="bg-white p-4 rounded-xl shadow-sm border border-platinum relative group animate-fade-in">
                      {/* Type Indicator */}
                      <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r ${
                        note.type === NoteType.HIGHLIGHT ? 'bg-yellow-400' : 
                        note.type === NoteType.EXTRACT ? 'bg-purple-500' : 'bg-blue-500'
                      }`}></div>
                      
                      <div className="pl-3">
                         <div className="flex items-center gap-2 mb-2">
                            {note.type === NoteType.HIGHLIGHT && <Highlighter size={12} className="text-yellow-600"/>}
                            {note.type === NoteType.EXTRACT && <Sparkles size={12} className="text-purple-600"/>}
                            {note.type === NoteType.DEEP_DIVE && <MessageSquare size={12} className="text-blue-600"/>}
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-grey">{note.type.replace('_', ' ')}</span>
                         </div>
                         
                         <div className="bg-seashell p-3 rounded-lg text-sm text-slate-grey italic mb-3 border-l-2 border-toffee-brown/20">
                            "{note.originalText}"
                         </div>
                         
                         {note.content && (
                           <div className="text-deep-space-blue text-sm leading-relaxed">
                              {note.content === "Extracting insight..." ? (
                                <div className="flex items-center gap-2 text-toffee-brown animate-pulse">
                                   <Sparkles size={14} /> Generating insight...
                                </div>
                              ) : note.content}
                           </div>
                         )}
                      </div>
                      
                      {/* Actions */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                         <button onClick={() => setNotes(n => n.filter(i => i.id !== note.id))} className="p-1.5 hover:bg-red-50 text-slate-grey hover:text-red-500 rounded"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* Sidebar Mode: CHAT (Deep Dive) */}
          {sidebarMode === 'chat' && (
            <>
               <div className="flex-none bg-white p-4 border-b border-platinum flex items-center justify-between shadow-sm z-10">
                  <div className="flex items-center gap-2">
                     <MessageSquare size={18} className="text-toffee-brown" />
                     <h3 className="font-bold text-deep-space-blue">Deep Dive</h3>
                  </div>
                  <button onClick={() => {
                     // Confirm close logic could go here
                     setSidebarMode('notes');
                  }} className="text-slate-grey hover:text-toffee-brown p-1 rounded hover:bg-parchment transition-colors">
                     <X size={20} />
                  </button>
               </div>
               
               <div className="bg-white px-4 py-3 border-b border-platinum">
                  <div className="bg-seashell p-3 rounded-lg text-xs text-slate-grey italic line-clamp-3 border-l-2 border-toffee-brown/30">
                     Target: "{chatContext}"
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-mint-cream">
                  {chatHistory.map(msg => (
                     <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                           msg.role === 'user' 
                              ? 'bg-toffee-brown text-white rounded-tr-sm' 
                              : 'bg-white text-deep-space-blue border border-platinum rounded-tl-sm shadow-sm'
                        }`}>
                           {msg.text}
                        </div>
                     </div>
                  ))}
                  {isAiThinking && (
                     <div className="flex justify-start">
                        <div className="bg-white border border-platinum px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                           <span className="w-1.5 h-1.5 bg-slate-grey rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                           <span className="w-1.5 h-1.5 bg-slate-grey rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                           <span className="w-1.5 h-1.5 bg-slate-grey rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                        </div>
                     </div>
                  )}
                  <div ref={chatEndRef} />
               </div>

               <div className="flex-none bg-white p-4 border-t border-platinum">
                  <div className="relative">
                     <textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                           if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleChatSend();
                           }
                        }}
                        placeholder="Ask a question or share a thought..."
                        className="w-full bg-white border border-platinum rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-toffee-brown/50 resize-none h-20 scrollbar-hide"
                     />
                     <button 
                        onClick={handleChatSend}
                        disabled={!chatInput.trim() || isAiThinking}
                        className="absolute right-3 bottom-3 w-8 h-8 bg-toffee-brown text-white rounded-full flex items-center justify-center hover:bg-[#85573D] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                     >
                        <ArrowUp size={16} strokeWidth={3} />
                     </button>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                     <button onClick={saveDeepDive} className="text-xs font-semibold text-slate-grey hover:text-toffee-brown flex items-center gap-1 transition-colors">
                        <Save size={14} /> Save & Exit
                     </button>
                     <span className="text-[10px] text-slate-grey/50 uppercase tracking-widest">Powered by Gemini</span>
                  </div>
               </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};