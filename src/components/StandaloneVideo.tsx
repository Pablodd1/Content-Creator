import React, { useState } from 'react';
import { Video, Loader2, FileText, CheckCircle2, Copy } from 'lucide-react';

export default function StandaloneVideo() {
  const [videoPrompt, setVideoPrompt] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateScript = async () => {
    if (!videoPrompt.trim()) {
      setError('Por favor, ingresa un prompt o idea para el video.');
      return;
    }
    setIsGenerating(true);
    setError('');
    setGeneratedScript(null);
    try {
      const res = await fetch('/api/gemini/generate-video-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: videoPrompt, platform })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedScript(data.script);
      } else {
        setError(data.error || 'Error al generar el workflow del video');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedScript) {
      navigator.clipboard.writeText(generatedScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-3 mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Video className="text-purple-600" /> Creador de Workflow de Video
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Diseña guiones y workflows de producción (Shot Lists) para videos cortos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Tu Idea de Video (Prompt):
              </label>
              <textarea 
                value={videoPrompt}
                onChange={e => setVideoPrompt(e.target.value)}
                placeholder="Ej. Un video revelando nuestra nueva colección de cocinas minimalistas. Tono elegante y misterioso..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-3 text-sm"
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Plataforma Objetivo:</label>
              <select 
                value={platform}
                onChange={e => setPlatform(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-2 text-sm font-medium"
              >
                <option value="TikTok">TikTok</option>
                <option value="Instagram Reels">Instagram Reels</option>
                <option value="YouTube Shorts">YouTube Shorts</option>
                <option value="YouTube Horizontal">YouTube Horizontal (Largo formato)</option>
              </select>
            </div>

            <button 
              onClick={handleGenerateScript}
              disabled={isGenerating}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition-all"
            >
              {isGenerating ? <><Loader2 size={16} className="animate-spin" /> Creando Workflow...</> : <><FileText size={16} /> Generar Workflow</>}
            </button>
            
            {error && <div className="text-xs text-red-500 font-bold bg-red-50 p-2 rounded border border-red-100">{error}</div>}
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 h-full min-h-[400px] flex flex-col shadow-sm">
            {generatedScript ? (
              <div className="w-full flex-1 flex flex-col animate-in fade-in zoom-in duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <FileText size={18} className="text-purple-600" /> Resultado del Workflow
                  </h3>
                  <button onClick={handleCopy} className="text-xs flex items-center gap-1 font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                    {copied ? <><CheckCircle2 size={14} className="text-green-500" /> Copiado</> : <><Copy size={14} /> Copiar</>}
                  </button>
                </div>
                
                <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700 overflow-y-auto max-h-[500px]">
                  <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    {generatedScript}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 dark:text-slate-600 text-center space-y-3 flex flex-col items-center justify-center h-full min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Video size={32} className="opacity-50" />
                </div>
                <p className="text-sm font-medium">El guion y workflow creativo<br/>aparecerá aquí</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
