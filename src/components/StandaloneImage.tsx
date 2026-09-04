import React, { useState } from 'react';
import { ImageIcon, Loader2, Sparkles, Download, FileText } from 'lucide-react';

export default function StandaloneImage() {
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStyle, setImageStyle] = useState('Comercial & Producto 8K');
  const [imageRatio, setImageRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [appliedPrompt, setAppliedPrompt] = useState('');
  const [error, setError] = useState('');

  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhancePrompt = async () => {
    if (!imagePrompt.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/gemini/enhance-image-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt, style: imageStyle, context: '' })
      });
      const data = await res.json();
      if (data.success && data.enhanced?.englishDiffusionPrompt) {
        setImagePrompt(data.enhanced.englishDiffusionPrompt);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      setError('Por favor, ingresa un prompt.');
      return;
    }
    setIsGeneratingImg(true);
    setError('');
    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt, aspectRatio: imageRatio, style: imageStyle })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedImg(data.imageUrl);
        setAppliedPrompt(data.appliedPrompt || imagePrompt);
      } else {
        setError(data.error || 'Error al generar la imagen');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión al generar imagen');
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!generatedImg) return;
    try {
      const response = await fetch(generatedImg);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `imagen-independiente-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-3 mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <ImageIcon className="text-blue-600" /> Generador de Imágenes AI
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Crea imágenes hiperrealistas de manera independiente.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between items-center">
                <span>Tu Prompt (Descripción):</span>
                <button 
                  onClick={handleEnhancePrompt} 
                  disabled={isEnhancing}
                  className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 px-2 py-1 rounded"
                >
                  {isEnhancing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  Mejorar Prompt (Workflow Completo)
                </button>
              </label>
              <textarea 
                value={imagePrompt}
                onChange={e => setImagePrompt(e.target.value)}
                placeholder="Ej. Una botella de perfume sobre un pedestal de mármol..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-3 text-xs"
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Estilo Visual:</label>
              <select 
                value={imageStyle}
                onChange={e => setImageStyle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-2 text-xs font-medium"
              >
                <option value="Comercial & Producto 8K">Comercial & Producto 8K</option>
                <option value="Arquitectura & Espacios Modernos">Arquitectura & Espacios Modernos</option>
                <option value="Minimalista Editorial">Minimalista Editorial</option>
                <option value="Estudio de Lujo Softbox">Estudio de Lujo Softbox</option>
              </select>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {['1:1', '16:9', '9:16', '4:3'].map(ratio => (
                <button
                  key={ratio}
                  onClick={() => setImageRatio(ratio as any)}
                  className={`py-2 text-xs font-bold rounded-lg border ${
                    imageRatio === ratio ? 'bg-blue-50 border-blue-600 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : 'bg-slate-50 border-gray-200 dark:bg-slate-800 dark:border-slate-700'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            <button 
              onClick={handleGenerateImage}
              disabled={isGeneratingImg}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition-all"
            >
              {isGeneratingImg ? <><Loader2 size={16} className="animate-spin" /> Renderizando píxeles...</> : <><ImageIcon size={16} /> Renderizar Imagen</>}
            </button>
            
            {error && <div className="text-xs text-red-500 font-bold bg-red-50 p-2 rounded border border-red-100">{error}</div>}
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-800 h-full min-h-[400px] flex flex-col items-center justify-center">
            {generatedImg ? (
              <div className="w-full space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="relative group rounded-lg overflow-hidden shadow-md">
                  <img src={generatedImg} alt="Generada" className="w-full object-contain max-h-[500px]" />
                </div>
                {appliedPrompt && (
                  <div className="text-[10px] text-slate-500 font-mono p-3 bg-white dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700 shadow-sm leading-relaxed">
                    <strong className="block mb-1 text-slate-700 dark:text-slate-300">Prompt Traducido (Background Process):</strong> 
                    {appliedPrompt}
                  </div>
                )}
                <button onClick={handleDownloadImage} className="w-full py-3 bg-slate-900 hover:bg-black dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                  <Download size={16} /> Descargar Imagen HR
                </button>
              </div>
            ) : (
              <div className="text-slate-400 dark:text-slate-600 text-center space-y-3 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <ImageIcon size={32} className="opacity-50" />
                </div>
                <p className="text-sm font-medium">Tu render aparecerá aquí</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
