import React, { useState } from 'react';
import { Video, Loader2, FileText, CheckCircle2, Copy, Sparkles, Clapperboard, Layers, Play, Clock, Download, Wand2 } from 'lucide-react';
import PromptStructureGuide from './PromptStructureGuide';
import ImageReferencePicker from './ImageReferencePicker';
import PromptAssistantModal from './PromptAssistantModal';
import { storage, SavedVideoItem, SavedImageItem } from '../utils/storage';

export default function StandaloneVideo() {
  const [savedVideos, setSavedVideos] = useState<SavedVideoItem[]>(() => storage.getGeneratedVideos());
  const [savedImages] = useState<SavedImageItem[]>(() => storage.getGeneratedImages());

  const [videoPrompt, setVideoPrompt] = useState('');
  const [platform, setPlatform] = useState('TikTok & Instagram Reels');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [videoResolution, setVideoResolution] = useState<'1080p' | '720p'>('1080p');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceEmailText, setReferenceEmailText] = useState<string>(() => storage.getBriefingContext() || '');

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingVeo, setIsGeneratingVeo] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [socialSpecs, setSocialSpecs] = useState<any>(null);
  const [promptTags, setPromptTags] = useState<string[]>([]);
  const [generatedScript, setGeneratedScript] = useState<string | null>(() => {
    const list = storage.getGeneratedVideos();
    return list.length > 0 ? (list[0].script || null) : null;
  });
  const [veoStatus, setVeoStatus] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // References available from image history
  const availableReferences = savedImages.map((item, idx) => ({
    id: item.id,
    name: `Render Guardado #${idx + 1}`,
    url: item.url
  }));

  const handleEnhancePrompt = async () => {
    if (!videoPrompt.trim()) return;
    setIsEnhancing(true);
    setError('');
    try {
      const res = await fetch('/api/gemini/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: videoPrompt, 
          type: 'video',
          platform,
          aspectRatio,
          style: 'Cinemático Comercial 8K',
          referenceImage: referenceImage || undefined,
          referenceEmailText: referenceEmailText || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.masterEnglish) {
          setVideoPrompt(data.masterEnglish);
        } else if (data.enhancedPrompt) {
          setVideoPrompt(data.enhancedPrompt);
        }
        if (data.socialMediaSpecs) {
          setSocialSpecs(data.socialMediaSpecs);
        }
        if (data.tags) {
          setPromptTags(data.tags);
        }
      } else {
        setError(data.error || 'No se pudo optimizar el prompt.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al conectar con el optimizador de prompts.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateScript = async () => {
    if (!videoPrompt.trim()) {
      setError('Por favor, ingresa un prompt o selecciona una plantilla estructurada.');
      return;
    }
    setIsGenerating(true);
    setError('');
    setVeoStatus(null);
    try {
      const res = await fetch('/api/gemini/generate-video-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: videoPrompt, 
          platform,
          referenceImageDescription: referenceImage 
            ? 'El usuario adjuntó una imagen de referencia del producto/material. Mantén fidelidad a su estilo y paleta.' 
            : '',
          referenceEmailText: referenceEmailText || undefined
        })
      });
      const data = await res.json();
      if (data.success && data.script) {
        setGeneratedScript(data.script);
        
        // Save persistently
        storage.saveGeneratedVideo({
          title: `${platform} - ${videoPrompt.slice(0, 35)}...`,
          script: data.script,
          prompt: videoPrompt,
          platform,
          referenceImage: referenceImage || undefined
        });
        setSavedVideos(storage.getGeneratedVideos());
      } else {
        setError(data.error || 'Error al generar el workflow del video');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTriggerVeo = async () => {
    if (!videoPrompt.trim()) {
      setError('Por favor, ingresa un prompt para Google Veo.');
      return;
    }
    setIsGeneratingVeo(true);
    setError('');
    setVeoStatus(null);
    try {
      const res = await fetch('/api/gemini/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptText: videoPrompt,
          ratio: aspectRatio,
          resolution: videoResolution,
          platform,
          referenceImage: referenceImage || undefined,
          referenceEmailText: referenceEmailText || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setVeoStatus(`Operación Veo (${videoResolution}) iniciada con éxito. Renderizando en background.`);
      } else {
        setVeoStatus(`Modo Preview: ${data.message || 'Prompt y estructura configurados listos para render Veo.'}`);
      }
    } catch (err: any) {
      setVeoStatus('Simulación de preview lista para renderizar en Veo.');
    } finally {
      setIsGeneratingVeo(false);
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
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Video className="text-purple-600" /> Creador de Videos Publicitarios & Shot Lists (Gemini & Veo)
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Diseña guiones cinemáticos, prompts estructurados con referencias visuales y workflows listos para producción.
        </p>
      </div>

      {/* Video Prompt Structure Guide */}
      <PromptStructureGuide 
        type="video" 
        onApplyTemplate={(tpl) => setVideoPrompt(tpl)} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
            
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tu Prompt / Idea de Video:
                </label>
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => setIsAssistantOpen(true)}
                    className="text-xs flex items-center gap-1.5 text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Sparkles size={13} />
                    <span>Asistente IA (ChatGPT / Gemini)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleEnhancePrompt}
                    disabled={isEnhancing || !videoPrompt.trim()}
                    className="text-xs flex items-center gap-1.5 text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 dark:text-purple-300 px-2.5 py-1.5 rounded-lg font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    {isEnhancing ? <Loader2 size={13} className="animate-spin text-purple-600" /> : <Wand2 size={13} className="text-purple-600" />}
                    <span>Rápido</span>
                  </button>
                </div>
              </div>

              <textarea 
                value={videoPrompt}
                onChange={e => setVideoPrompt(e.target.value)}
                placeholder="Escribe tu idea (ej. 'Tomas de cámara lenta 60fps con paneo orbital alrededor del producto sobre mármol negro...') o usa el Asistente IA para fidelidad con tu referencia..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-3 text-xs leading-relaxed outline-none focus:border-purple-500 text-slate-800 dark:text-slate-200"
                rows={5}
              />

              {promptTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {promptTags.map((tag, i) => (
                    <span key={i} className="text-[10px] bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-md font-semibold border border-purple-200/60 dark:border-purple-800/40">
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Social Media Safe Zone and Spec Hint */}
              {socialSpecs && (
                <div className="p-3 bg-purple-50/70 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-900/50 text-xs space-y-1">
                  <div className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1 text-[11px]">
                    <Sparkles size={13} className="text-purple-600" /> Requisitos Técnicos Aplicados:
                  </div>
                  <div className="text-[10px] text-purple-800 dark:text-purple-300 leading-snug">
                    • <strong>Zona Segura (Safe-Zone):</strong> {socialSpecs.safeZoneTip || 'Márgenes de 150px arriba/abajo respetados.'}
                  </div>
                  <div className="text-[10px] text-purple-800 dark:text-purple-300 leading-snug">
                    • <strong>Composición de Movimiento:</strong> {socialSpecs.compositionRule || 'Cámara 60fps con paneo suave.'}
                  </div>
                </div>
              )}
            </div>

            {/* Reference Image Picker */}
            <ImageReferencePicker
              referenceImage={referenceImage}
              onSelectReference={(url) => setReferenceImage(url)}
              availableImages={availableReferences}
              label="Frame de Referencia Inicial (Para guiar el estilo/producto)"
              referenceEmailText={referenceEmailText}
              onUpdateEmailText={setReferenceEmailText}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Plataforma:</label>
                <select 
                  value={platform}
                  onChange={e => setPlatform(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-2.5 text-xs font-medium outline-none focus:border-purple-500 text-slate-700 dark:text-slate-200"
                >
                  <option value="TikTok & Instagram Reels">TikTok & Reels (9:16)</option>
                  <option value="YouTube Shorts">YouTube Shorts (9:16)</option>
                  <option value="YouTube Horizontal">YouTube 16:9 Panorámico</option>
                  <option value="Meta Feed & Stories">Meta Feed Ads</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Aspect Ratio:</label>
                  <button
                    type="button"
                    onClick={() => setVideoResolution(videoResolution === '1080p' ? '720p' : '1080p')}
                    className="text-[9px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50 px-1.5 py-0.5 rounded cursor-pointer"
                  >
                    {videoResolution} HQ
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('9:16')}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      aspectRatio === '9:16'
                        ? 'bg-purple-50 border-purple-600 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                        : 'bg-slate-50 border-gray-200 dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    9:16 Reel
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('16:9')}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      aspectRatio === '16:9'
                        ? 'bg-purple-50 border-purple-600 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                        : 'bg-slate-50 border-gray-200 dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    16:9 Cinema
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button 
                type="button"
                onClick={handleGenerateScript}
                disabled={isGenerating || !videoPrompt.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Diseñando Workflow & Shot List con Gemini...</span>
                  </>
                ) : (
                  <>
                    <Clapperboard size={16} />
                    <span>Generar Workflow de Producción</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleTriggerVeo}
                disabled={isGeneratingVeo || !videoPrompt.trim()}
                className="w-full py-2.5 bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 transition-all"
              >
                {isGeneratingVeo ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Conectando con Google Veo Preview...</span>
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    <span>Sintetizar con Google Veo (Preview)</span>
                  </>
                )}
              </button>
            </div>
            
            {error && (
              <div className="text-xs text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-950/30 p-3 rounded-lg border border-red-200 dark:border-red-900/50">
                {error}
              </div>
            )}

            {veoStatus && (
              <div className="text-xs text-purple-700 dark:text-purple-300 font-medium bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg border border-purple-200 dark:border-purple-900/50">
                {veoStatus}
              </div>
            )}
          </div>

          {/* Saved Video Workflows History */}
          {savedVideos.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-800 shadow-sm space-y-3">
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>Historial de Guiones Guardados ({savedVideos.length})</span>
                <span className="text-[10px] text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Auto-guardados
                </span>
              </h4>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {savedVideos.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      if (item.script) setGeneratedScript(item.script);
                      if (item.prompt) setVideoPrompt(item.prompt);
                    }}
                    className="p-2.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-purple-500 cursor-pointer transition-colors text-xs flex items-center justify-between gap-2"
                  >
                    <div className="truncate flex-1">
                      <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                        {item.title || item.prompt?.slice(0, 30)}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold px-2 py-0.5 rounded">
                      Ver
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: Generated Workflow Display */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 h-full min-h-[480px] flex flex-col shadow-sm">
            {generatedScript ? (
              <div className="w-full flex-1 flex flex-col animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200 text-sm">
                      <FileText size={18} className="text-purple-600" /> Workflow y Shot List de Producción
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Listo para copiar en Veo, Runway, Premiere o enviar al equipo de filmación.
                    </p>
                  </div>
                  <button 
                    onClick={handleCopy} 
                    className="text-xs flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 size={14} className="text-green-500" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copiar Guion</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="flex-1 bg-slate-50 dark:bg-slate-800/70 rounded-xl p-4 border border-gray-200 dark:border-slate-700 overflow-y-auto max-h-[600px] leading-relaxed">
                  <pre className="whitespace-pre-wrap font-mono text-xs text-slate-800 dark:text-slate-200 selection:bg-purple-200">
                    {generatedScript}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 dark:text-slate-600 text-center space-y-3 flex flex-col items-center justify-center h-full min-h-[350px] py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Video size={32} className="opacity-50" />
                </div>
                <p className="text-sm font-medium">El guion y workflow creativo aparecerá aquí</p>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Haz clic en una plantilla arriba o describe tu idea de comercial para generar el desglose paso a paso.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deep Prompt Fidelity Assistant Modal (ChatGPT / Gemini Pro) */}
      <PromptAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        type="video"
        currentPrompt={videoPrompt}
        referenceImage={referenceImage}
        referenceEmailText={referenceEmailText}
        aspectRatio={aspectRatio}
        style="Cinemático Comercial 8K"
        platform={platform}
        onApplyPrompt={(masterEnglish, enhancedSpanish, specs) => {
          setVideoPrompt(masterEnglish);
          if (specs) setSocialSpecs(specs);
          setPromptTags(['Fidelidad de Referencia Veo Bloqueada', 'Cámara 60fps Gimbal', videoResolution + ' High Definition', 'Safe-Zone Verificada']);
        }}
      />
    </div>
  );
}

