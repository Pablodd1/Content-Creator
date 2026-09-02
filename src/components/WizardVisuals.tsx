import React, { useState } from 'react';
import { Image as ImageIcon, Video, RefreshCw, Download, Sparkles, Loader2 } from 'lucide-react';

export default function WizardVisuals({ masterBrief, onNext }: { masterBrief: any, onNext: () => void }) {
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [generatedImg, setGeneratedImg] = useState('');
  const [imageRatio, setImageRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [imageStyle, setImageStyle] = useState('Comercial & Producto 8K');
  const [appliedPrompt, setAppliedPrompt] = useState('');
  const [error, setError] = useState('');

  // Default prompt based on brief
  const [imagePrompt, setImagePrompt] = useState(() => {
    return masterBrief?.instagram?.visualDirection || 'Fotografía de producto profesional, 8k, iluminación de estudio...';
  });

  const handleGenerateImage = async () => {
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
      a.download = `campana-visual-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-3 mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <ImageIcon className="text-blue-600" /> Paso 3: Generación Visual (100% Gemini)
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Convierte tu Briefing en Assets Visuales (Imágenes y prompts detallados para IA de Video).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <ImageIcon size={18} /> Asset Estático (Google Imagen 3)
            </h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Prompt Visual Base:</label>
              <textarea 
                value={imagePrompt}
                onChange={e => setImagePrompt(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-3 text-xs"
                rows={3}
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
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGeneratingImg ? <><Loader2 size={16} className="animate-spin" /> Generando con Gemini...</> : <><Sparkles size={16} /> Generar Imagen Ahora</>}
            </button>
            
            {error && <div className="text-xs text-red-500 font-bold bg-red-50 p-2 rounded">{error}</div>}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold flex items-center gap-2">
              <Video size={18} /> Instrucciones para IA de Video (Veo/Sora)
            </h3>
            <p className="text-xs text-slate-500">Copia este prompt enriquecido en tu generador de video favorito.</p>
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700 font-mono text-xs text-slate-700 dark:text-slate-300">
              {masterBrief?.tiktokReels?.sceneScript || 'No se generó guion.'}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-800 h-full min-h-[400px] flex flex-col items-center justify-center">
            {generatedImg ? (
              <div className="w-full space-y-4">
                <img src={generatedImg} alt="Generada" className="w-full rounded-lg shadow-md object-contain max-h-[500px]" />
                {appliedPrompt && (
                  <div className="text-[10px] text-slate-500 font-mono p-2 bg-white dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700">
                    <strong>Prompt Real:</strong> {appliedPrompt}
                  </div>
                )}
                <button onClick={handleDownloadImage} className="w-full py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                  <Download size={16} /> Descargar Imagen
                </button>
              </div>
            ) : (
              <div className="text-slate-400 dark:text-slate-600 text-center space-y-2 flex flex-col items-center">
                <ImageIcon size={48} className="opacity-20" />
                <p className="text-sm font-medium">La imagen aparecerá aquí</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 flex justify-end">
        <button 
          onClick={onNext}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
        >
          Ir a Estrategia y Calendario &rarr;
        </button>
      </div>
    </div>
  );
}
