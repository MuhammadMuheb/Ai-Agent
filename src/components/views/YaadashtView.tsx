import React, { useState } from 'react';
import { Brain, FileText, Plus, Search, Trash2, Folder, ExternalLink, Calendar, Tag, Shield, Eye } from 'lucide-react';
import { Card } from '../ui/Card.tsx';
import { Button } from '../ui/Button.tsx';
import { Badge } from '../ui/Badge.tsx';
import { MemoryItem, WorkspaceFile } from '../../types/index.ts';

interface YaadashtViewProps {
  memories: MemoryItem[];
  onAddMemory: (category: 'boss' | 'mama' | 'projects' | 'habits', title: string, detail: string) => void;
  onDeleteMemory: (id: string) => void;
  workspaceFiles: WorkspaceFile[];
  onSelectFile: (file: WorkspaceFile) => void;
  onCreateFile: (name: string, content: string) => void;
}

export const YaadashtView: React.FC<YaadashtViewProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory,
  workspaceFiles,
  onSelectFile,
  onCreateFile,
}) => {
  const [activeTab, setActiveTab] = useState<'memory' | 'workspace'>('memory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Add Memory Modal State
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newCategory, setNewCategory] = useState<'boss' | 'mama' | 'projects' | 'habits'>('habits');

  // Create Workspace File State
  const [showAddFile, setShowAddFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDetail.trim()) return;
    onAddMemory(newCategory, newTitle.trim(), newDetail.trim());
    setNewTitle('');
    setNewDetail('');
    setShowAddMemory(false);
  };

  const handleSaveFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    onCreateFile(newFileName.trim(), newFileContent);
    setNewFileName('');
    setNewFileContent('');
    setShowAddFile(false);
  };

  const filteredMemories = memories.filter((m) => {
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.detail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const filteredFiles = workspaceFiles.filter((f) =>
    !searchQuery.trim() ||
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Header & Sub-tab Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1c2a38] pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-[#e6edf3]">Yaadasht & Muhib Workspace</h2>
          <p className="text-xs text-[#8b9bab]">
            Permanent Memory Vault (Restart par bhi yaad rahega) aur Safe File Sandbox.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-[#0b1118] border border-[#1c2a38] rounded-lg p-1 gap-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab('memory')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'memory'
                ? 'bg-[#27d7e6] text-[#05080c] font-semibold'
                : 'text-[#8b9bab] hover:text-[#e6edf3]'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            Memory Vault ({memories.length})
          </button>
          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'workspace'
                ? 'bg-[#27d7e6] text-[#05080c] font-semibold'
                : 'text-[#8b9bab] hover:text-[#e6edf3]'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            Muhib Workspace ({workspaceFiles.length})
          </button>
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8b9bab] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'memory' ? 'Yaadasht mein dhoondein...' : 'Workspace files dhoondein...'}
            className="w-full bg-[#111a24] border border-[#1c2a38] rounded-lg pl-9 pr-3 py-2 text-xs text-[#e6edf3] focus:outline-none focus:border-[#27d7e6]"
          />
        </div>

        {activeTab === 'memory' ? (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#111a24] border border-[#1c2a38] rounded-lg px-3 py-1.5 text-xs text-[#e6edf3] focus:outline-none"
            >
              <option value="all">Tamam Categories</option>
              <option value="boss">Boss (Sir Imran)</option>
              <option value="mama">Mama</option>
              <option value="projects">Projects</option>
              <option value="habits">Meri Aadatein</option>
            </select>
            <Button size="sm" variant="primary" onClick={() => setShowAddMemory(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Nayi Memory
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="primary" onClick={() => setShowAddFile(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Nayi File
          </Button>
        )}
      </div>

      {/* 1. Memory Vault Cards */}
      {activeTab === 'memory' && (
        <div className="space-y-4">
          {showAddMemory && (
            <Card className="border-[#27d7e6]/50">
              <form onSubmit={handleSaveMemory} className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#1c2a38] pb-2">
                  <h4 className="text-sm font-semibold text-[#e6edf3]">Nayi Memory Mehfooz Karein</h4>
                  <button
                    type="button"
                    onClick={() => setShowAddMemory(false)}
                    className="text-xs text-[#8b9bab] hover:text-[#e6edf3]"
                  >
                    Cancel
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Memory ka unwaan (e.g. Chai ki timing)"
                    className="bg-[#111a24] border border-[#1c2a38] rounded-lg px-3 py-2 text-xs text-[#e6edf3] focus:outline-none focus:border-[#27d7e6]"
                    autoFocus
                  />
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="bg-[#111a24] border border-[#1c2a38] rounded-lg px-3 py-2 text-xs text-[#e6edf3] focus:outline-none"
                  >
                    <option value="boss">Boss (Sir Imran)</option>
                    <option value="mama">Mama</option>
                    <option value="projects">Projects</option>
                    <option value="habits">Meri Aadatein</option>
                  </select>
                </div>
                <textarea
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                  placeholder="Tafseelat likhein..."
                  rows={3}
                  className="w-full bg-[#111a24] border border-[#1c2a38] rounded-lg p-3 text-xs text-[#e6edf3] focus:outline-none focus:border-[#27d7e6] resize-none"
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddMemory(false)}>
                    Radd
                  </Button>
                  <Button type="submit" size="sm" variant="primary">
                    Mehfooz Karein
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMemories.map((mem) => (
              <Card key={mem.id} className="flex flex-col justify-between hover:border-[#27d7e6]/40 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        mem.category === 'boss'
                          ? 'laal'
                          : mem.category === 'mama'
                          ? 'peela'
                          : mem.category === 'projects'
                          ? 'cyan'
                          : 'hara'
                      }
                      size="sm"
                    >
                      {mem.category.toUpperCase()}
                    </Badge>
                    <button
                      onClick={() => onDeleteMemory(mem.id)}
                      className="text-[#8b9bab] hover:text-[#ff4d5e] p-1 transition-colors cursor-pointer"
                      title="Memory delete karein"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-sm font-semibold text-[#e6edf3]">{mem.title}</h4>
                  <p className="text-xs text-[#8b9bab] leading-relaxed">{mem.detail}</p>
                </div>
                <div className="pt-3 border-t border-[#1c2a38] text-[10px] font-mono text-[#8b9bab]">
                  Updated: {new Date(mem.updatedAt).toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 2. Workspace Files Sandbox */}
      {activeTab === 'workspace' && (
        <div className="space-y-4">
          {showAddFile && (
            <Card className="border-[#27d7e6]/50">
              <form onSubmit={handleSaveFile} className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#1c2a38] pb-2">
                  <h4 className="text-sm font-semibold text-[#e6edf3]">Nayi Workspace File Likhein</h4>
                  <button
                    type="button"
                    onClick={() => setShowAddFile(false)}
                    className="text-xs text-[#8b9bab] hover:text-[#e6edf3]"
                  >
                    Cancel
                  </button>
                </div>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="File name (e.g. Meeting_Notes.md)"
                  className="w-full bg-[#111a24] border border-[#1c2a38] rounded-lg px-3 py-2 text-xs text-[#e6edf3] focus:outline-none focus:border-[#27d7e6]"
                  autoFocus
                />
                <textarea
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  placeholder="Content yahan likhein ya paste karein..."
                  rows={6}
                  className="w-full bg-[#111a24] border border-[#1c2a38] rounded-lg p-3 text-xs text-[#e6edf3] font-mono focus:outline-none focus:border-[#27d7e6] resize-none"
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddFile(false)}>
                    Radd
                  </Button>
                  <Button type="submit" size="sm" variant="primary">
                    File Save Karein
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFiles.map((file) => (
              <Card
                key={file.id}
                interactive
                onClick={() => onSelectFile(file)}
                className="flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#111a24] border border-[#1c2a38] flex items-center justify-center text-[#27d7e6] shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#e6edf3]">{file.name}</h4>
                    <p className="text-xs font-mono text-[#8b9bab] mt-0.5">
                      {file.size} • {file.updatedAt}
                    </p>
                    <p className="text-xs text-[#8b9bab] line-clamp-2 mt-1">
                      {file.content}
                    </p>
                  </div>
                </div>
                <Eye className="w-4 h-4 text-[#8b9bab] hover:text-[#27d7e6] shrink-0 mt-1" />
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
