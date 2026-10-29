import React, { useState } from 'react';
import { X, Folder, File, Shield, AlertTriangle, Eye, Lock, FileCode, Check, Search } from 'lucide-react';
import { soundFX } from '../utils/soundEffects.ts';

interface FileSandboxModalProps {
  onClose: () => void;
  onLogAction: (action: string, status: 'approved' | 'sent' | 'read' | 'pending' | 'denied', details?: string) => void;
}

interface SandboxedFile {
  id: string;
  name: string;
  folder: string;
  size: string;
  type: string;
  content: string;
  permission: 'safe' | 'approval' | 'restricted';
}

export const FileSandboxModal: React.FC<FileSandboxModalProps> = ({
  onClose,
  onLogAction,
}) => {
  const [selectedFolder, setSelectedFolder] = useState<string>('/projects/boss-website/');
  const [selectedFile, setSelectedFile] = useState<SandboxedFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteAlert, setDeleteAlert] = useState<string | null>(null);

  const sandboxedFiles: SandboxedFile[] = [
    {
      id: 'f1',
      name: 'index.html',
      folder: '/projects/boss-website/',
      size: '1.2 KB',
      type: 'html',
      permission: 'safe',
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Sir Imran Website Project</title>
    <link rel="stylesheet" href="/theme.css" />
  </head>
  <body class="dark-sci-fi">
    <div id="root"></div>
  </body>
</html>`,
    },
    {
      id: 'f2',
      name: 'theme.css',
      folder: '/projects/boss-website/',
      size: '2.4 KB',
      type: 'css',
      permission: 'safe',
      content: `:root {
  --bg-primary: #05080c;
  --accent-cyan: #27d7e6;
  --accent-green: #2ee59d;
  --accent-amber: #f5b83d;
  --accent-rose: #ff4d5e;
}
body {
  background-color: var(--bg-primary);
  color: #ffffff;
  font-family: monospace;
}`,
    },
    {
      id: 'f3',
      name: 'care-guide.md',
      folder: '/projects/plant-diagnostics/',
      size: '3.1 KB',
      type: 'md',
      permission: 'safe',
      content: `# Indoor Plant Care Master Guide

## 1. Monstera Deliciosa
- Water when top 2 inches of soil are dry.
- Prefers bright, indirect light.
- Toxic to cats and dogs if ingested.

## 2. Snake Plant
- Drought tolerant, water every 2-3 weeks.
- Excellent air purifier.`,
    },
    {
      id: 'f4',
      name: 'mama-reminders.txt',
      folder: '/notes/',
      size: '420 B',
      type: 'txt',
      permission: 'safe',
      content: `1. Shaam ko dahi aur fresh roti le kar aana.
2. Roz raat 9 baje mama ko call zaroor karni hai.
3. Weekend par biryani banani hai.`,
    },
    {
      id: 'f5',
      name: 'song-ideas.md',
      folder: '/notes/',
      size: '880 B',
      type: 'md',
      permission: 'safe',
      content: `# YouTube Song & Video Edit Ideas
- Lofi beat visualizer with cyan neon grid background.
- Slowed & reverb aesthetic montage.
- Late night coding chill instrumental track.`,
    },
  ];

  const folders = [
    '/projects/boss-website/',
    '/projects/plant-diagnostics/',
    '/notes/',
  ];

  const filteredFiles = sandboxedFiles.filter(
    (f) =>
      f.folder === selectedFolder &&
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectFile = (file: SandboxedFile) => {
    setSelectedFile(file);
    setDeleteAlert(null);
    onLogAction(`Sandbox file padhi gayi: ${file.name}`, 'read', `Folder: ${file.folder}`);
    soundFX.playSuccess();
  };

  const handleDeleteAttempt = (fileName: string) => {
    soundFX.playAlert();
    setDeleteAlert(
      `HIFATZI ALERT: File '${fileName}' ko delete karna strictly BAND hai. Rule: Delete by default band hai.`
    );
    onLogAction(`Unauthorized delete request blocked: ${fileName}`, 'denied', 'Security sandbox policy enforced');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="sci-border bg-[#050b12] border-cyan-500/40 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_30px_rgba(39,215,230,0.2)]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-cyan-500/20 bg-[#081522] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#27d7e6]" />
            <h2 className="font-mono text-sm font-bold text-white tracking-wider flex items-center gap-2">
              DIN 30-31: FILE TOOLS &amp; SAFE SANDBOX EXPLORER
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                SANDBOXED
              </span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-cyan-950/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explorer Body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3">
          {/* Left Folder & File Tree */}
          <div className="border-r border-cyan-500/20 bg-[#06101a] p-3 flex flex-col space-y-3 overflow-y-auto">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-cyan-400" />
              <input
                type="text"
                placeholder="File dhoondo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-black/50 border border-cyan-500/25 rounded-lg pl-8 pr-2 py-1.5 text-white placeholder-slate-400 font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1.5">
                ● ALLOWED FOLDERS (SANDBOX):
              </span>
              <div className="space-y-1">
                {folders.map((folder) => (
                  <button
                    key={folder}
                    onClick={() => {
                      setSelectedFolder(folder);
                      setSelectedFile(null);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs font-mono flex items-center gap-2 transition ${
                      selectedFolder === folder
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'text-slate-400 hover:bg-[#0a1724] hover:text-slate-200'
                    }`}
                  >
                    <Folder className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{folder}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1.5">
                ● FILES ({filteredFiles.length}):
              </span>
              <div className="space-y-1">
                {filteredFiles.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => handleSelectFile(f)}
                    className={`p-2 rounded-lg cursor-pointer text-xs font-mono flex items-center justify-between border transition ${
                      selectedFile?.id === f.id
                        ? 'bg-[#0f283d] border-cyan-400/50 text-white shadow-sm'
                        : 'bg-[#091522] border-cyan-500/10 text-slate-300 hover:bg-[#0c1d2e]'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{f.name}</span>
                    </div>
                    <span className="text-[9px] text-slate-500">{f.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right File Viewer & Permissions */}
          <div className="md:col-span-2 p-4 flex flex-col justify-between overflow-y-auto space-y-3 bg-[#081421]">
            {selectedFile ? (
              <div className="space-y-3 flex-1 flex flex-col">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <File className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono text-xs font-bold text-white">
                      {selectedFile.folder}{selectedFile.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      Level: Green (Padhna)
                    </span>
                    <button
                      onClick={() => handleDeleteAttempt(selectedFile.name)}
                      className="text-[10px] font-mono text-rose-400 hover:text-rose-200 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30"
                    >
                      Delete (Try)
                    </button>
                  </div>
                </div>

                {deleteAlert && (
                  <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs font-mono text-rose-200 flex items-center gap-2 animate-bounce-short">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{deleteAlert}</span>
                  </div>
                )}

                <div className="flex-1 bg-black/60 rounded-xl border border-cyan-500/20 p-3 overflow-y-auto max-h-[340px]">
                  <pre className="font-mono text-xs text-slate-200 whitespace-pre-wrap">
                    {selectedFile.content}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2">
                <Shield className="w-12 h-12 text-cyan-400/40 mb-2" />
                <h3 className="font-mono text-sm font-bold text-white">
                  KISI FILE PAR CLICK KAREIN
                </h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Agent sirf allowed folders ki files khol aur padh sakta hai. Faltu ya sensitive folders sandboxed hain.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
