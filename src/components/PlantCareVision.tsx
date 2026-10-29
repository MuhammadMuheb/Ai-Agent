import React, { useState, useRef } from 'react';
import { Leaf, Upload, Camera, AlertTriangle, CheckCircle2, Droplets, Sun, Wind, ShieldAlert, Sparkles, Send, RefreshCw } from 'lucide-react';
import { samplePlants } from '../data/initialData.ts';
import { PlantCareResult } from '../types/index.ts';

interface PlantCareVisionProps {
  onSendToChat: (analysis: PlantCareResult, imageBase64: string) => void;
  onAnalysisStart: () => void;
  onAnalysisEnd: () => void;
}

export const PlantCareVision: React.FC<PlantCareVisionProps> = ({
  onSendToChat,
  onAnalysisStart,
  onAnalysisEnd,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PlantCareResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageFile = (file: File) => {
    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setSelectedImage(b64);
      analyzePlantPhoto(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = async (url: string) => {
    try {
      setErrorMsg(null);
      // Fetch sample image and convert to base64
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = () => {
        const b64 = reader.result as string;
        setSelectedImage(b64);
        analyzePlantPhoto(b64);
      };
      reader.readAsDataURL(blob);
    } catch {
      setErrorMsg('Sample photo load nahi ho saka. Apni photo upload karein.');
    }
  };

  const analyzePlantPhoto = async (base64Image: string) => {
    setIsAnalyzing(true);
    onAnalysisStart();
    setErrorMsg(null);
    try {
      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Image,
          mode: 'plant',
        }),
      });

      if (!res.ok) {
        throw new Error('Image analysis failed');
      }

      const data = await res.json();
      if (data.analysis) {
        setResult(data.analysis);
      } else {
        setResult({
          isPlant: true,
          commonName: 'Identified Plant',
          healthStatus: 'Analyzed',
          romanUrduSummary: data.rawText || 'Plant ki tafseelat analyze ho gayi hain.',
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Photo analyze karne mein masla aya. Dobara koshish karein.');
    } finally {
      setIsAnalyzing(false);
      onAnalysisEnd();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pr-1 space-y-4">
      {/* Header Banner */}
      <div className="bg-[#0b1b29] p-3 rounded-xl border border-emerald-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="font-mono text-sm font-bold text-white tracking-wide">
              PLANT CARE &amp; VISION
            </h3>
            <p className="text-[11px] text-slate-300">
              Photo upload karein — Gemini Pro se botanical shanakht aur care guide payen.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
          PRO VISION
        </span>
      </div>

      {/* Upload Zone */}
      <div className="sci-border p-4 bg-[#091522] flex flex-col items-center justify-center text-center relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleImageFile(e.target.files[0]);
            }
          }}
        />

        {selectedImage ? (
          <div className="w-full flex flex-col items-center gap-3">
            <div className="relative group w-full max-w-[280px] h-[190px] rounded-xl overflow-hidden border border-cyan-500/40 shadow-[0_0_15px_rgba(39,215,230,0.15)]">
              <img
                src={selectedImage}
                alt="Selected Plant"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 text-black font-mono text-xs font-bold flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Nayi Photo Chuno
                </button>
              </div>
            </div>

            {isAnalyzing && (
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-500/40 animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Gemini 3.1 Pro se photo check ho rahi hai...
              </div>
            )}
          </div>
        ) : (
          <div className="w-full py-6 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-xs font-mono font-medium text-white mb-1">
              Plant ya Leaf ki Photo Drag karein ya Chunein
            </p>
            <p className="text-[11px] text-slate-400 mb-3">
              Pot, patta, beemari, ya indoor plants ki saaf tasveer
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-mono px-4 py-2 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              Upload Photo
            </button>
          </div>
        )}

        {/* Quick Sample Presets */}
        <div className="w-full mt-4 pt-3 border-t border-cyan-500/20">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 text-left">
            Ya Test Sample Chunein:
          </p>
          <div className="grid grid-cols-2 gap-2 text-left">
            {samplePlants.map((plant, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(plant.image)}
                className="p-1.5 rounded-lg bg-[#0d2030] hover:bg-[#122b40] border border-cyan-500/20 hover:border-emerald-400/40 flex items-center gap-2 text-left transition group"
              >
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-8 h-8 rounded-md object-cover border border-cyan-500/30"
                />
                <div className="overflow-hidden">
                  <div className="text-[11px] font-mono text-cyan-300 font-semibold truncate group-hover:text-emerald-300">
                    {plant.name.split('(')[0]}
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">
                    {plant.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Analysis Results Display */}
      {result && (
        <div className="sci-border p-4 bg-[#091522] space-y-3.5">
          {/* Plant Title & Names */}
          <div className="flex items-start justify-between border-b border-cyan-500/20 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-mono text-base font-bold text-emerald-300">
                  {result.commonName || 'Plant'}
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                  Identified
                </span>
              </div>
              {result.scientificName && (
                <p className="text-xs italic text-cyan-400 font-mono">
                  {result.scientificName} {result.family ? `(${result.family})` : ''}
                </p>
              )}
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {result.healthStatus || 'Healthy'}
              </span>
            </div>
          </div>

          {/* Roman Urdu Guidance Summary */}
          {result.romanUrduSummary && (
            <div className="bg-[#0e2233] p-3 rounded-lg border border-cyan-500/30">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                MUHIB AI GUIDANCE (ROMAN URDU):
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {result.romanUrduSummary}
              </p>
            </div>
          )}

          {/* Structured Care Breakdown */}
          {result.careGuide && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-[#0a1724] rounded-lg border border-cyan-500/20 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  PANI (WATERING):
                </div>
                <p className="text-slate-300 text-[11px] font-sans">
                  {result.careGuide.watering}
                </p>
              </div>

              <div className="p-2.5 bg-[#0a1724] rounded-lg border border-cyan-500/20 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  DHOOP (SUNLIGHT):
                </div>
                <p className="text-slate-300 text-[11px] font-sans">
                  {result.careGuide.sunlight}
                </p>
              </div>

              <div className="p-2.5 bg-[#0a1724] rounded-lg border border-cyan-500/20 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Wind className="w-3.5 h-3.5 text-emerald-400" />
                  NAMI AUR MITTI (SOIL):
                </div>
                <p className="text-slate-300 text-[11px] font-sans">
                  {result.careGuide.soil || result.careGuide.humidity}
                </p>
              </div>

              <div className="p-2.5 bg-[#0a1724] rounded-lg border border-cyan-500/20 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-purple-400 font-bold">
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                  PETS / BILLI-KUTTA SAFETY:
                </div>
                <p className="text-slate-300 text-[11px] font-sans">
                  {result.careGuide.toxicity || 'Safe'}
                </p>
              </div>
            </div>
          )}

          {/* Quick Tips */}
          {result.quickTips && result.quickTips.length > 0 && (
            <div className="bg-[#0b1a26] p-2.5 rounded-lg border border-emerald-500/20">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1.5">
                ● ZAROORI NUKTE (QUICK TIPS):
              </span>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 font-sans">
                {result.quickTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Send to chat button */}
          <button
            onClick={() => {
              if (selectedImage) {
                onSendToChat(result, selectedImage);
              }
            }}
            className="w-full text-xs font-mono py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 border border-emerald-500/40 transition flex items-center justify-center gap-2 font-bold"
          >
            <Send className="w-3.5 h-3.5" />
            Chat Thread Mein Shamil Karein
          </button>
        </div>
      )}
    </div>
  );
};
