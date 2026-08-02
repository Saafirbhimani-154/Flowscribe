import React, { useState, useRef } from 'react';
import { Eye, Code2 } from 'lucide-react';

import type { MarkdownEditorProps } from './MarkdownEditor-interface';

/** Lightweight inline Markdown → HTML renderer (no external libraries) */
function renderMarkdown(md: string): string {
  const lines = md.split('\n');
  const html: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // --- Headings ---
    if (/^### (.+)/.test(line)) {
      if (inList) { html.push('</ul>'); inList = false; }
      line = line.replace(/^### (.+)/, '<h3 class="text-sm font-bold text-white mt-3 mb-1">$1</h3>');
      html.push(line); continue;
    }
    if (/^## (.+)/.test(line)) {
      if (inList) { html.push('</ul>'); inList = false; }
      line = line.replace(/^## (.+)/, '<h2 class="text-base font-bold text-white mt-4 mb-1">$1</h2>');
      html.push(line); continue;
    }
    if (/^# (.+)/.test(line)) {
      if (inList) { html.push('</ul>'); inList = false; }
      line = line.replace(/^# (.+)/, '<h1 class="text-lg font-bold text-white mt-4 mb-2">$1</h1>');
      html.push(line); continue;
    }

    // --- Bullet list ---
    if (/^[-*] (.+)/.test(line)) {
      if (!inList) { html.push('<ul class="list-disc pl-5 space-y-0.5 my-1">'); inList = true; }
      line = line.replace(/^[-*] (.+)/, '<li class="text-zinc-300 text-sm">$1</li>');
      // apply inline styles inside list item
      line = applyInline(line);
      html.push(line); continue;
    }

    // --- Numbered list ---
    if (/^\d+\. (.+)/.test(line)) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push('<ol class="list-decimal pl-5 space-y-0.5 my-1">');
      line = line.replace(/^\d+\. (.+)/, '<li class="text-zinc-300 text-sm">$1</li>');
      line = applyInline(line);
      html.push(line);
      html.push('</ol>');
      continue;
    }

    // Close list if we hit a non-list line
    if (inList) { html.push('</ul>'); inList = false; }

    // --- Horizontal rule ---
    if (/^---$/.test(line.trim())) {
      html.push('<hr class="border-zinc-700 my-2" />'); continue;
    }

    // --- Blockquote ---
    if (/^> (.+)/.test(line)) {
      line = line.replace(/^> (.+)/, '<blockquote class="border-l-2 border-blue-500 pl-3 italic text-zinc-400 text-sm my-1">$1</blockquote>');
      line = applyInline(line);
      html.push(line); continue;
    }

    // --- Empty line ---
    if (line.trim() === '') {
      html.push('<div class="h-2"></div>'); continue;
    }

    // --- Normal paragraph ---
    line = applyInline(line);
    html.push(`<p class="text-zinc-300 text-sm leading-relaxed">${line}</p>`);
  }

  if (inList) html.push('</ul>');
  return html.join('\n');
}

/** Apply inline styles: bold, italic, code, strikethrough */
function applyInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '<code class="bg-zinc-800 text-blue-300 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em class="text-zinc-200 italic">$1</em>')
    .replace(/~~([^~]+)~~/g, '<s class="text-zinc-500">$1</s>');
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Type here... Supports **bold**, *italic*, `code`, # headings, - bullet lists',
  borderClass = 'border-zinc-700 focus-within:border-blue-500',
}) => {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Auto-indent bullet on Enter
    if (e.key === 'Enter') {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const currentLine = value.substring(lineStart, start);
      const bulletMatch = currentLine.match(/^([-*] )/);
      if (bulletMatch) {
        e.preventDefault();
        const insertion = '\n' + bulletMatch[1];
        const newValue = value.substring(0, start) + insertion + value.substring(ta.selectionEnd);
        // Fire synthetic change event
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(ta, newValue);
          ta.dispatchEvent(new Event('input', { bubbles: true }));
          setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + insertion.length; }, 0);
        }
      }
    }
    // Tab inserts 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const newValue = value.substring(0, start) + '  ' + value.substring(ta.selectionEnd);
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(ta, newValue);
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 2; }, 0);
      }
    }
  };

  return (
    <div className={`w-full rounded-xl border ${borderClass} bg-zinc-900/50 transition overflow-hidden`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-700/60 bg-zinc-800/40">
        <div className="flex gap-2">
          <span className="text-zinc-600 text-xs font-mono">**bold**</span>
          <span className="text-zinc-600 text-xs font-mono">*italic*</span>
          <span className="text-zinc-600 text-xs font-mono">`code`</span>
          <span className="text-zinc-600 text-xs font-mono">- list</span>
        </div>
        <div className="flex rounded-lg overflow-hidden border border-zinc-700 text-xs">
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`flex items-center gap-1 px-2.5 py-1 transition ${mode === 'edit' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:bg-zinc-700'}`}
          >
            <Code2 className="w-3 h-3" /> Edit
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 transition ${mode === 'preview' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:bg-zinc-700'}`}
          >
            <Eye className="w-3 h-3" /> Preview
          </button>
        </div>
      </div>

      {/* Edit mode */}
      {mode === 'edit' && (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent p-4 text-white text-sm focus:outline-none min-h-[140px] resize-none font-mono leading-relaxed placeholder:text-zinc-600"
          rows={6}
        />
      )}

      {/* Preview mode */}
      {mode === 'preview' && (
        <div
          className="min-h-[140px] p-4 overflow-y-auto"
          dangerouslySetInnerHTML={{
            __html: value.trim()
              ? renderMarkdown(value)
              : '<p class="text-zinc-600 text-sm italic">Nothing to preview yet...</p>'
          }}
        />
      )}
    </div>
  );
};
