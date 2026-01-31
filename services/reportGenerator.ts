import { Podcast, Note, NoteType } from '../types';
import { marked } from 'marked';

export const generateReportHTML = (podcast: Podcast, notes: Note[], summaryData?: any): string => {
  const highlights = notes.filter(n => n.type === NoteType.HIGHLIGHT);
  const extracts = notes.filter(n => n.type === NoteType.EXTRACT);
  const deepDives = notes.filter(n => n.type === NoteType.DEEP_DIVE);

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Use marked to parse markdown in content, ensuring it's a string
  const parseMarkdown = (text: string) => {
    try {
      return marked.parse(text);
    } catch (e) {
      return text;
    }
  };

  // Inline CSS for the report
  const styles = `
    body {
      margin: 0;
      padding: 0;
      background-color: #E5E5E5; /* Browser background outside the page */
      font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1E293B;
      -webkit-print-color-adjust: exact;
    }
    .page-container {
      max-width: 800px;
      margin: 40px auto;
      background-color: #F8F5F0;
      padding: 48px 32px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      box-sizing: border-box;
    }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { color: #996548; font-weight: bold; font-family: "Merriweather", serif; font-size: 24px; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px; }
    .report-title { color: #727C8B; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; font-weight: 600; }
    .podcast-title { font-family: "Merriweather", serif; font-size: 32px; font-weight: 700; color: #1E293B; margin: 0 0 16px 0; line-height: 1.2; }
    .meta-divider { height: 1px; background-color: #EBECEE; margin: 16px auto; width: 100%; max-width: 200px; }
    .meta-info { font-size: 14px; color: #727C8B; font-weight: 500; letter-spacing: 0.5px; }
    
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 48px; }
    .stat-card { background: #FCFCFC; border: 1px solid #EBECEE; border-radius: 12px; padding: 16px; text-align: center; }
    .stat-number { font-size: 32px; font-weight: 700; color: #996548; display: block; margin-bottom: 4px; font-family: "Merriweather", serif; }
    .stat-label { font-size: 11px; color: #727C8B; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }

    .section-title { font-size: 20px; font-weight: 700; color: #1E293B; margin: 0 0 16px 0; padding-bottom: 12px; border-bottom: 1px solid #EBECEE; }
    
    .summary-card { 
      background: linear-gradient(135deg, #996548 0%, #F9EFE9 100%); 
      border-radius: 24px; 
      padding: 32px; 
      margin-bottom: 48px; 
      color: #1E293B;
      position: relative;
      overflow: hidden;
    }
    
    .summary-section { margin-bottom: 24px; }
    .summary-section:last-child { margin-bottom: 0; }
    .summary-heading { font-size: 16px; font-weight: 700; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; color: #FCFCFC; text-shadow: 0 1px 2px rgba(0,0,0,0.1); }
    /* Darker text for the lighter part of the card */
    .summary-section:not(:first-child) .summary-heading { color: #996548; text-shadow: none; }
    
    .summary-content { font-size: 15px; line-height: 1.6; color: #FCFCFC; }
    .summary-section:not(:first-child) .summary-content { color: #1E293B; }
    
    .summary-content ul { margin: 0; padding-left: 20px; }
    .summary-content li { margin-bottom: 4px; }

    .notes-group { margin-bottom: 40px; page-break-inside: avoid; }
    .group-title { color: #996548; font-size: 18px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; font-family: "Merriweather", serif; }
    
    .note-card { background: #FCFCFC; border: 1px solid #EBECEE; border-radius: 12px; padding: 20px; margin-bottom: 16px; position: relative; overflow: hidden; page-break-inside: avoid; }
    .note-card.highlight { border-left: 4px solid #FCD34D; }
    .note-card.extract { border-left: 4px solid #A855F7; }
    .note-card.deep-dive { border-left: 4px solid #3B82F6; }
    
    .quote-box { background: #F9EFE9; padding: 12px 16px; border-radius: 8px; font-family: "Merriweather", serif; font-style: italic; color: #555; font-size: 14px; margin-bottom: 12px; line-height: 1.6; }
    .note-content { font-size: 15px; line-height: 1.6; color: #1E293B; }
    .insight-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; color: #727C8B; margin-bottom: 4px; display: block; }
    
    /* Strong/Bold handling within generated markdown content */
    strong, b { font-weight: 700; color: #1E293B; }

    .footer { text-align: center; margin-top: 64px; padding-top: 32px; border-top: 1px solid #EBECEE; }
    .footer-brand { font-size: 12px; color: #727C8B; font-weight: 500; }
    .footer-slogan { font-family: "Merriweather", serif; color: #996548; font-style: italic; font-size: 14px; margin-top: 8px; }
    .footer-icon { color: #996548; margin-top: 16px; opacity: 0.8; }

    @media print {
      body { background: white; }
      .page-container { box-shadow: none; margin: 0; width: 100%; max-width: 100%; padding: 0; border: none; }
      .summary-card { background: #F9EFE9 !important; border: 1px solid #EBECEE; color: #1E293B !important; }
      .summary-heading, .summary-content { color: #1E293B !important; text-shadow: none !important; }
    }
  `;

  let summaryHTML = '';

  if (summaryData) {
    const { core_insights, personal_growth, actionable_tips } = summaryData;

    summaryHTML = `
      <div class="summary-section">
        <div class="summary-heading">✨ Core Insights</div>
        <div class="summary-content">
          ${core_insights || 'No insights generated.'}
        </div>
      </div>
      
      <div class="summary-section">
        <div class="summary-heading">🌱 Personal Growth</div>
        <div class="summary-content">
          ${personal_growth && personal_growth.length > 0 ?
        `<ul>${personal_growth.map((item: string) => `<li>${item}</li>`).join('')}</ul>`
        : 'No growth points generated.'}
        </div>
      </div>
      
      <div class="summary-section">
        <div class="summary-heading">🎯 Action Items</div>
        <div class="summary-content">
          ${actionable_tips && actionable_tips.length > 0 ?
        `<ul>${actionable_tips.map((item: string) => `<li>${item}</li>`).join('')}</ul>`
        : 'No action items generated.'}
        </div>
      </div>
      `;
  } else {
    summaryHTML = `<div style="text-align:center; padding: 20px; color: #727C8B;">Summary waiting to be generated...</div>`;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PodEcho Report - ${podcast.title}</title>
  <style>${styles}</style>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&display=swap" rel="stylesheet">
</head>
<body>
  <div class="page-container">
    <div class="header">
      <div class="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"></circle><path d="M4.93 19.07a10 10 0 0 1 0-14.14"></path><path d="M7.76 16.24a6 6 0 0 1 0-8.48"></path><path d="M16.24 7.76a6 6 0 0 1 8.48 0"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
        PodEcho
      </div>
      <div class="report-title">Learning Report</div>
      <h1 class="podcast-title">${podcast.title}</h1>
      <div class="meta-divider"></div>
      <div class="meta-info">
        ${podcast.host} &nbsp;|&nbsp; ${podcast.duration} &nbsp;|&nbsp; ${dateStr}
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-number">${highlights.length}</span>
        <span class="stat-label">Highlights</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">${extracts.length}</span>
        <span class="stat-label">Extracts</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">${deepDives.length}</span>
        <span class="stat-label">Deep Dives</span>
      </div>
    </div>

    <div class="section-title">Your Learning Summary</div>
    <div class="summary-card">
      ${summaryHTML}
    </div>

    <div class="section-title">Your Notes</div>
    
    ${highlights.length > 0 ? `
    <div class="notes-group">
      <div class="group-title">📝 Highlights</div>
      ${highlights.map(note => `
        <div class="note-card highlight">
          <div class="quote-box">"${note.originalText}"</div>
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${extracts.length > 0 ? `
    <div class="notes-group">
      <div class="group-title">✨ Extracted Insights</div>
      ${extracts.map(note => `
        <div class="note-card extract">
          <div class="quote-box">"${note.originalText}"</div>
          <div class="note-content">
            <span class="insight-label">Insight</span>
            ${parseMarkdown(note.content || '')}
          </div>
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${deepDives.length > 0 ? `
    <div class="notes-group">
      <div class="group-title">💬 Deep Reflections</div>
      ${deepDives.map(note => `
        <div class="note-card deep-dive">
          <div class="quote-box">"${note.originalText}"</div>
          <div class="note-content">
            <span class="insight-label">Reflection</span>
            <div style="white-space: pre-wrap;">${parseMarkdown(note.content || '')}</div>
          </div>
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    ${notes.length === 0 ? '<div style="text-align:center; color:#727C8B; margin: 40px 0;">No notes taken for this session.</div>' : ''}

    <div class="footer">
      <div class="footer-brand">Made with PodEcho</div>
      <div class="footer-slogan">"Make podcasts echo, not just pass through"</div>
      <div class="footer-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"></circle><path d="M4.93 19.07a10 10 0 0 1 0-14.14"></path><path d="M7.76 16.24a6 6 0 0 1 0-8.48"></path><path d="M16.24 7.76a6 6 0 0 1 8.48 0"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};