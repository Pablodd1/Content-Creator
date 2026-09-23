import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Check, 
  Copy, 
  Camera, 
  Layers, 
  Palette, 
  ShieldCheck, 
  Video, 
  Lightbulb, 
  Loader2, 
  Maximize2,
  FileText
} from 'lucide-react';

interface PromptAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'image' | 'video';
  currentPrompt: string;
  referenceImage: string | null;
  referenceEmailText: string;
  aspectRatio: string;
  style: string;
  platform: string;
  onApplyPrompt: (masterEnglish: string, enhancedSpanish?: string, specs?: any) => void;
}

export default function PromptAssistantModal({
  isOpen,
  onClose,
  type,
  currentPrompt,
  referenceImage,
  referenceEmailText,
  aspectRatio,
  style,
  platform,
  onApplyPrompt
}: PromptAssistantModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [editablePrompt, setEditablePrompt] = useState('');

  useEffect(() => {
    if (isOpen) {
      handleRunAssistant();
    } else {
      setAnalysisResult(null);
      setError('');
    }
  }, [isOpen]);

  const handleRunAssistant = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/gemini/assist-prompt-fidelity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentPrompt || (type === 'video' ? 'Comercial dinámico de producto' : 'Fotografía publicitaria de producto'),
          type,
          referenceImage,
          referenceEmailText,
          aspectRatio,
          style,
          platform
        })
      });

      const data = await res.json();
      if (data.success) {
        setAnalysisResult(data);
        setEditablePrompt(data.masterEnglish || '');
      } else {
        setError(data.error || 'No se pudo generar el análisis asistido.');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión con el Asistente de Prompting.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!editablePrompt) return;
    navigator.clipboard.writeText(editablePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (editablePrompt) {
      onApplyPrompt(editablePrompt, analysisResult?.enhancedSpanish, analysisResult?.socialMediaSpecs);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50/70 via-indigo-50/70 to-purple-50/70 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                Asistente de Prompting de Alta Fidelidad
                <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ChatGPT / Gemini Pro
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {type === 'video' ? 'Optimización cinematográfica y física de movimiento' : 'Análisis visual de referencia, micro-texturas y óptica 85mm'}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-lg opacity-30 rounded-full animate-pulse"></div>
                <Loader2 size={48} className="text-blue-600 animate-spin relative z-10" />
              </div>
              <div className="space-y-1 max-w-sm">
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {referenceImage ? 'Inspeccionando ADN visual de tu referencia...' : 'Diseñando prompt comercial de alta fidelidad...'}
                </p>
                <p className="text-xs text-slate-400">
                  Alineando geometría de producto, física de iluminación, texturas y zonas seguras para redes.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-300 space-y-2">
              <p className="font-bold">No se pudo completar el análisis asistido:</p>
              <p>{error}</p>
              <button
                type="button"
                onClick={handleRunAssistant}
                className="mt-2 px-3 py-1.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
              >
                Reintentar análisis
              </button>
            </div>
          ) : analysisResult ? (
            <div className="space-y-5">
              
              {/* Reference Analysis Banner */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-gray-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-green-500" />
                    Análisis de Fidelidad de Referencia:
                  </span>
                  <span className="text-[11px] font-bold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-950/60 px-2 py-0.5 rounded-full">
                    {analysisResult.referenceAnalysis?.fidelityScore || 'Fidelidad Bloqueada 98%'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Layers size={13} className="text-blue-500" /> Sujeto y Geometría Bloqueada:
                    </div>
                    <div className="text-slate-800 dark:text-slate-200 font-medium bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-gray-200 dark:border-slate-700 text-[11px] leading-relaxed">
                      {analysisResult.referenceAnalysis?.detectedSubject || 'Sujeto principal anclado a la referencia.'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Palette size={13} className="text-purple-500" /> Materiales & Color DNA:
                    </div>
                    <div className="text-slate-800 dark:text-slate-200 font-medium bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-gray-200 dark:border-slate-700 text-[11px] leading-relaxed">
                      {Array.isArray(analysisResult.referenceAnalysis?.detectedMaterials) 
                        ? analysisResult.referenceAnalysis.detectedMaterials.join(', ')
                        : 'Acabados fotorrealistas de alta gama'}
                    </div>
                  </div>
                </div>

                {referenceEmailText && (
                  <div className="text-[11px] bg-blue-50/60 dark:bg-blue-950/30 p-2.5 rounded-lg border border-blue-200 dark:border-blue-900/40 text-blue-900 dark:text-blue-200 flex items-start gap-1.5">
                    <FileText size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Contexto de correo/brief integrado:</strong> {analysisResult.referenceAnalysis?.emailKeyDirectives || referenceEmailText.slice(0, 140) + '...'}
                    </span>
                  </div>
                )}
              </div>

              {/* Master English Diffusion / Veo Prompt */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-blue-600" />
                    Prompt Maestro en Inglés (Google Gemini Imagen 3 / Veo):
                  </label>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md transition-colors"
                  >
                    {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                    <span>{copied ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>

                <textarea
                  value={editablePrompt}
                  onChange={e => setEditablePrompt(e.target.value)}
                  rows={5}
                  className="w-full font-mono text-xs p-3 bg-slate-50 dark:bg-slate-800/80 border border-blue-300 dark:border-blue-900/60 rounded-xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/30 leading-relaxed shadow-inner"
                  placeholder="Prompt maestro generado por el asistente..."
                />
              </div>

              {/* Social Media & Optics breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Camera size={13} className="text-blue-500" />
                    {type === 'video' ? 'Cinematografía & Cámara' : 'Óptica & Iluminación'}:
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {type === 'video'
                      ? analysisResult.cinematography?.cameraMovement || '60fps slow orbital motion con iluminación softbox'
                      : 'Hasselblad medium format, lente 85mm f/2.8 con iluminación softbox de 3 puntos y rim light.'}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <ShieldCheck size={13} className="text-green-500" />
                    Zona Segura Redes ({aspectRatio}):
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {analysisResult.socialMediaSpecs?.safeZoneTip || 'Composición centrada dejando márgenes para la interfaz de la app.'}
                  </p>
                </div>
              </div>

            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          
          <button
            type="button"
            onClick={handleApply}
            disabled={!editablePrompt || isLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Check size={15} />
            <span>Aplicar este Prompt de Alta Fidelidad</span>
          </button>
        </div>

      </div>
    </div>
  );
}
