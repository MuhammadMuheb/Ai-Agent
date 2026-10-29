import React, { useState, useEffect } from 'react';
import {
  X,
  Cpu,
  Terminal,
  Play,
  Copy,
  Check,
  RefreshCw,
  FolderTree,
  FileCode,
  ShieldCheck,
  Sparkles,
  Layers
} from 'lucide-react';
import { soundFX } from '../utils/soundEffects.ts';

interface McpModalProps {
  onClose: () => void;
  onLogAction?: (action: string, status: 'approved' | 'sent' | 'read' | 'pending' | 'denied', details?: string) => void;
}

export const McpModal: React.FC<McpModalProps> = ({ onClose, onLogAction }) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'resources' | 'config' | 'logs'>('tools');
  const [mcpData, setMcpData] = useState<any>(null);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [toolArgs, setToolArgs] = useState<string>('{}');
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [resourceContent, setResourceContent] = useState<string | null>(null);
  const [copiedConfig, setCopiedConfig] = useState(false);

  // Fetch MCP manifest on mount
  useEffect(() => {
    fetch('/api/mcp')
      .then((res) => res.json())
      .then((data) => {
        setMcpData(data);
        if (data.tools && data.tools.length > 0) {
          setSelectedTool(data.tools[0]);
          setToolArgs(JSON.stringify(getDefaultArgs(data.tools[0].name), null, 2));
        }
      })
      .catch((err) => console.error('Failed to load MCP manifest:', err));
  }, []);

  const getDefaultArgs = (name: string) => {
    switch (name) {
      case 'add_task':
        return { title: 'Boss ko shaam 6 baje website preview dena', time: '06:00 PM' };
      case 'analyze_message':
        return { sender: 'Boss (Sir Imran)', text: 'Website ka design aaj shaam tak bhej do. Dark theme zaroori hai.', source: 'WhatsApp' };
      case 'get_memories':
        return { category: 'all' };
      case 'add_memory':
        return { category: 'boss', title: 'Sir Imran Design Rule', detail: 'Monospace headers aur clean cyber cyan aesthetic pasand hai.' };
      case 'read_sandbox_file':
        return { filePath: '/projects/boss-website/theme.css' };
      case 'diagnose_plant':
        return { plantName: 'Monstera Deliciosa' };
      case 'generate_website_brief':
        return { clientName: 'Sir Imran', message: 'Dark theme personal dashboard website design banayein.' };
      default:
        return {};
    }
  };

  const handleSelectTool = (tool: any) => {
    setSelectedTool(tool);
    setToolArgs(JSON.stringify(getDefaultArgs(tool.name), null, 2));
    setExecutionResult(null);
  };

  const handleExecuteTool = async () => {
    if (!selectedTool) return;
    setExecuting(true);
    setExecutionResult(null);

    let parsedArgs = {};
    try {
      parsedArgs = JSON.parse(toolArgs);
    } catch {
      alert('Invalid JSON in arguments.');
      setExecuting(false);
      return;
    }

    const payload = {
      jsonrpc: '2.0',
      id: `call-${Date.now()}`,
      method: 'tools/call',
      params: {
        name: selectedTool.name,
        arguments: parsedArgs,
      },
    };

    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setExecutionResult(data);
      soundFX.playSuccess();
      onLogAction?.(`MCP Tool Called: ${selectedTool.name}`, 'approved', 'JSON-RPC 2.0');
    } catch (err: any) {
      setExecutionResult({ error: err.message });
      soundFX.playAlert();
    } finally {
      setExecuting(false);
    }
  };

  const handleReadResource = async (uri: string) => {
    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: `res-${Date.now()}`,
          method: 'resources/read',
          params: { uri },
        }),
      });
      const data = await res.json();
      setResourceContent(data.result?.contents?.[0]?.text || 'No content returned');
      soundFX.playSuccess();
    } catch (err: any) {
      setResourceContent(`Error reading resource: ${err.message}`);
    }
  };

  const claudeDesktopConfig = {
    mcpServers: {
      'muhib-ai': {
        url: `${typeof window !== 'undefined' ? window.location.origin : ''}/api/mcp`,
        description: 'Muhib AI Personal Assistant & Horticultural Vision Engine',
      },
    },
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(claudeDesktopConfig, null, 2));
    setCopiedConfig(true);
    soundFX.playSuccess();
    setTimeout(() => setCopiedConfig(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="sci-border bg-[#050b12] border-cyan-500/40 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-[0_0_35px_rgba(39,215,230,0.25)]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-cyan-500/20 bg-[#081522] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#2ee59d] animate-pulse" />
            <h2 className="font-mono text-sm font-bold text-white tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              MODEL CONTEXT PROTOCOL (MCP) SERVER &amp; EXPLORER
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                JSON-RPC 2.0 ONLINE
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

        {/* Tab Navigation */}
        <div className="flex border-b border-cyan-500/20 bg-[#061019] px-4 gap-2">
          <button
            onClick={() => setActiveTab('tools')}
            className={`font-mono text-xs py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'tools'
                ? 'border-cyan-400 text-cyan-300 font-bold bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            MCP TOOLS ({mcpData?.tools?.length || 8})
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`font-mono text-xs py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'resources'
                ? 'border-emerald-400 text-emerald-300 font-bold bg-emerald-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5 text-emerald-400" />
            RESOURCES ({mcpData?.resources?.length || 5})
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`font-mono text-xs py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'config'
                ? 'border-amber-400 text-amber-300 font-bold bg-amber-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            CLIENT CONFIG (.JSON)
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-hidden p-4">
          {activeTab === 'tools' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
              {/* Left Tools List */}
              <div className="md:col-span-4 border border-cyan-500/20 rounded-xl bg-[#07131f] p-3 flex flex-col space-y-2 overflow-y-auto max-h-[580px]">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                  ● REGISTERED MCP TOOLS:
                </span>
                {mcpData?.tools?.map((tool: any) => (
                  <button
                    key={tool.name}
                    onClick={() => handleSelectTool(tool)}
                    className={`text-left p-2.5 rounded-lg text-xs font-mono transition border ${
                      selectedTool?.name === tool.name
                        ? 'bg-[#0f283d] border-cyan-400/60 text-white shadow-sm'
                        : 'bg-[#0a1826] border-cyan-500/10 text-slate-300 hover:bg-[#0c1e2f]'
                    }`}
                  >
                    <div className="font-bold text-cyan-300 flex items-center justify-between">
                      <span>{tool.name}</span>
                      <span className="text-[9px] text-emerald-400">tool</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 font-sans">
                      {tool.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Right Execution & Schema Inspector */}
              <div className="md:col-span-8 flex flex-col space-y-3 overflow-y-auto max-h-[580px] bg-[#07131f] p-4 rounded-xl border border-cyan-500/20">
                {selectedTool ? (
                  <>
                    <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                      <div>
                        <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-emerald-400" />
                          tool/{selectedTool.name}
                        </h3>
                        <p className="text-xs text-slate-300 font-sans mt-0.5">
                          {selectedTool.description}
                        </p>
                      </div>
                      <button
                        onClick={handleExecuteTool}
                        disabled={executing}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_12px_rgba(39,215,230,0.3)] disabled:opacity-50"
                      >
                        {executing ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Executing...
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            Run Tool (JSON-RPC)
                          </>
                        )}
                      </button>
                    </div>

                    {/* Arguments Editor */}
                    <div>
                      <label className="block text-xs font-mono text-cyan-300 font-semibold mb-1">
                        Tool Arguments (JSON):
                      </label>
                      <textarea
                        rows={4}
                        value={toolArgs}
                        onChange={(e) => setToolArgs(e.target.value)}
                        className="w-full text-xs font-mono bg-black/50 border border-cyan-500/30 rounded-lg p-2.5 text-cyan-200 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Result Output Display */}
                    {executionResult && (
                      <div className="space-y-1.5 flex-1">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                          ● JSON-RPC 2.0 RESPONSE:
                        </span>
                        <pre className="text-xs font-mono bg-black/60 p-3 rounded-lg border border-emerald-500/30 text-emerald-200 overflow-x-auto max-h-56">
                          {JSON.stringify(executionResult, null, 2)}
                        </pre>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8 text-slate-400">
                    <Cpu className="w-12 h-12 text-cyan-400/30 mb-2" />
                    <p className="font-mono text-xs">Kisi bhi tool par click karke test karein.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
              {/* Left Resources List */}
              <div className="md:col-span-5 border border-cyan-500/20 rounded-xl bg-[#07131f] p-3 flex flex-col space-y-2 overflow-y-auto max-h-[580px]">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                  ● MCP RESOURCES (READABLE):
                </span>
                {mcpData?.resources?.map((res: any) => (
                  <button
                    key={res.uri}
                    onClick={() => {
                      setSelectedResource(res);
                      handleReadResource(res.uri);
                    }}
                    className={`text-left p-2.5 rounded-lg text-xs font-mono transition border ${
                      selectedResource?.uri === res.uri
                        ? 'bg-[#0f283d] border-emerald-400/60 text-white'
                        : 'bg-[#0a1826] border-cyan-500/10 text-slate-300 hover:bg-[#0c1e2f]'
                    }`}
                  >
                    <div className="font-bold text-emerald-300">{res.name}</div>
                    <div className="text-[10px] text-cyan-400 truncate">{res.uri}</div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 font-sans">
                      {res.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Right Content Viewer */}
              <div className="md:col-span-7 bg-[#07131f] p-4 rounded-xl border border-cyan-500/20 flex flex-col space-y-3 overflow-y-auto max-h-[580px]">
                {selectedResource ? (
                  <>
                    <div className="border-b border-cyan-500/20 pb-2">
                      <span className="font-mono text-xs font-bold text-emerald-300">
                        {selectedResource.name}
                      </span>
                      <p className="text-[11px] font-mono text-slate-400">{selectedResource.uri}</p>
                    </div>
                    <pre className="flex-1 bg-black/60 p-3 rounded-lg border border-cyan-500/20 text-xs font-mono text-slate-200 whitespace-pre-wrap overflow-y-auto">
                      {resourceContent || 'Loading...'}
                    </pre>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8 text-slate-400">
                    <FolderTree className="w-12 h-12 text-emerald-400/30 mb-2" />
                    <p className="font-mono text-xs">Kisi bhi MCP resource par click karein.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="max-w-2xl mx-auto space-y-4 py-4">
              <div className="bg-[#081827] p-4 rounded-xl border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    CLAUDE DESKTOP / CURSOR MCP CONFIGURATION:
                  </h3>
                  <button
                    onClick={handleCopyConfig}
                    className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold flex items-center gap-1 transition"
                  >
                    {copiedConfig ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedConfig ? 'Copied!' : 'Copy Config'}
                  </button>
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  Yeh JSON snippet apne Claude Desktop config (`claude_desktop_config.json`) ya Cursor MCP settings mein paste karein taake external models Muhib AI ke tools call kar sakein.
                </p>
                <pre className="text-xs font-mono bg-black/60 p-3 rounded-lg border border-cyan-500/20 text-cyan-300 overflow-x-auto">
                  {JSON.stringify(claudeDesktopConfig, null, 2)}
                </pre>
              </div>

              <div className="bg-[#07131f] p-4 rounded-xl border border-emerald-500/20 text-xs font-mono space-y-2">
                <span className="text-emerald-400 font-bold block">● PROTOCOL DETAILS:</span>
                <p className="text-slate-300">
                  - Specification: Model Context Protocol (MCP) 2024-11-05
                </p>
                <p className="text-slate-300">
                  - Transport: JSON-RPC 2.0 over HTTP POST
                </p>
                <p className="text-slate-300">
                  - Active Endpoint: <code className="text-cyan-300">/api/mcp</code>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
