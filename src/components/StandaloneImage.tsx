import React, { useState, useEffect } from 'react';
import { ImageIcon, Loader2, Sparkles, Download, FileText, Layers, CheckCircle2, ShieldCheck, Instagram, Video, Monitor, Wand2, Building2, Camera, Compass, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import PromptStructureGuide from './PromptStructureGuide';
import ImageReferencePicker from './ImageReferencePicker';
import PromptAssistantModal from './PromptAssistantModal';
import { storage, SavedImageItem } from '../utils/storage';
import { ARCHITECTURAL_TEMPLATES, ArchitecturalTemplate, promptRefiner } from '../services/promptRefiner';

export default function StandaloneImage() {
  const [savedHistory, setSavedHistory] = useState<SavedImageItem[]>(() => storage.getGeneratedImages());
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStyle, setImageStyle] = useState('Comercial & Producto 8K');
  const [imageRatio, setImageRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [imageResolution, setImageResolution] = useState<'2K' | '1K'>('2K');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceEmailText, setReferenceEmailText] = useState<string>(() => storage.getBriefingContext() || '');
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(() => {
    const list = storage.getGeneratedImages();
    return list.length > 0 ? list[0].url : null;
  });
  const [appliedPrompt, setAppliedPrompt] = useState('');
  const [socialSpecs, setSocialSpecs] = useState<any>(null);
  const [promptTags, setPromptTags] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Architectural Photography Prompt Refiner State
  const [selectedArchTemplate, setSelectedArchTemplate] = useState<string>('auto');
  const [appliedArchSpecs, setAppliedArchSpecs] = useState<any>(null);
  const [isRefiningArch, setIsRefiningArch] = useState(false);
  const [showArchDetails, setShowArchDetails] = useState(false);

  // Available reference images from storage
  const availableReferences = savedHistory.map((item, idx) => ({
    id: item.id,
    name: `Render Guardado #${idx + 1}`,
    url: item.url
  }));

  const handleRefineWithArchitecturalTemplate = async () => {
    if (!imagePrompt.trim()) {
      setError('Por favor escribe una idea o descripción base antes de refinar con arquitectura.');
      return;
    }
    setIsRefiningArch(true);
    setError('');
    try {
      const res = await fetch('/api/prompt-refiner/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          templateId: selectedArchTemplate === 'auto' ? undefined : selectedArchTemplate,
          aspectRatio: imageRatio,
          style: imageStyle,
          referenceImage: referenceImage || undefined,
          referenceEmailText: referenceEmailText || undefined
        })
      });
      const data = await res.json();
      if (data.success && data.refinedEnglishPrompt) {
        setImagePrompt(data.refinedEnglishPrompt);
        setAppliedArchSpecs(data.architecturalSpecs);
        const templName = data.templateUsed?.name || 'Arquitectura Pro';
        setPromptTags([
          `🏛️ ${templName}`,
          `📷 ${data.architecturalSpecs?.lensFocalLength?.split(',')[0] || 'Tilt-Shift 24mm'}`,
          `💡 ${data.architecturalSpecs?.lighting?.split(',')[0] || 'Luz Difusa 5600K'}`,
          `${imageResolution} Ultra HD`
        ]);
      } else {
        setError(data.error || 'No se pudo refinar el prompt con la plantilla arquitectónica.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al conectar con el servicio Prompt Refiner.');
    } finally {
      setIsRefiningArch(false);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!imagePrompt.trim()) return;
    setIsEnhancing(true);
    setError('');
    try {
      const res = await fetch('/api/gemini/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: imagePrompt, 
          type: 'image',
          aspectRatio: imageRatio,
          style: imageStyle, 
          referenceImage: referenceImage || undefined,
          referenceEmailText: referenceEmailText || undefined,
          platform: imageRatio === '9:16' ? 'Instagram Reels & TikTok' : imageRatio === '1:1' ? 'Instagram & Facebook Feed' : 'YouTube & Web'
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.masterEnglish) {
          setImagePrompt(data.masterEnglish);
        } else if (data.enhancedPrompt) {
          setImagePrompt(data.enhancedPrompt);
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

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      setError('Por favor, ingresa un prompt o usa el Asistente de Prompting.');
      return;
    }
    setIsGeneratingImg(true);
    setError('');
    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: imagePrompt, 
          aspectRatio: imageRatio, 
          style: imageStyle,
          resolution: imageResolution,
          referenceImage: referenceImage || undefined,
          referenceEmailText: referenceEmailText || undefined,
          architecturalTemplateId: selectedArchTemplate === 'auto' ? undefined : selectedArchTemplate
        })
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setGeneratedImg(data.imageUrl);
        setAppliedPrompt(data.appliedPrompt || imagePrompt);
        if (data.architecturalSpecs) {
          setAppliedArchSpecs(data.architecturalSpecs);
        }

        // Persistent save
        storage.saveGeneratedImage({
          url: data.imageUrl,
          prompt: imagePrompt,
          appliedPrompt: data.appliedPrompt,
          style: imageStyle,
          aspectRatio: imageRatio,
          hasReference: !!referenceImage
        });
        setSavedHistory(storage.getGeneratedImages());
      } else {
        setError(data.error || 'Error al generar la imagen');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión al generar imagen');
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handleDownloadImage = async (urlToDownload?: string) => {
    const target = urlToDownload || generatedImg;
    if (!target) return;
    try {
      const response = await fetch(target);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `imagen-marketing-hq-${Date.now()}.png`;
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
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <ImageIcon className="text-blue-600" /> Estudio de Imágenes HQ (Google Gemini Imagen 3.1)
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Renderizado en Ultra HD (2K), optimizado automáticamente para los requisitos visuales de cada red social.
        </p>
      </div>

      {/* Structure Guide for Image Prompts with Social Media Requirements */}
      <PromptStructureGuide 
        type="image" 
        onApplyTemplate={(tpl) => setImagePrompt(tpl)} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
            
            <div className="space-y-2">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tu Prompt o Idea Base:
                </label>
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => setIsAssistantOpen(true)}
                    className="text-xs flex items-center gap-1.5 text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Sparkles size={13} />
                    <span>Asistente IA (ChatGPT / Gemini)</span>
                  </button>
                  <button 
                    type="button"
                    onClick={handleEnhancePrompt} 
                    disabled={isEnhancing || !imagePrompt.trim()}
                    className="text-xs flex items-center gap-1.5 text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 dark:text-blue-300 px-2.5 py-1.5 rounded-lg font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    {isEnhancing ? <Loader2 size={13} className="animate-spin text-blue-600" /> : <Wand2 size={13} className="text-blue-600" />}
                    <span>Rápido</span>
                  </button>
                </div>
              </div>

              <textarea 
                value={imagePrompt}
                onChange={e => setImagePrompt(e.target.value)}
                placeholder="Escribe tu idea (ej. 'Botella de perfume de lujo sobre piedra volcánica negra con gotas de agua y luz suave') o usa el Asistente IA para fidelidad con tu referencia..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-3 text-xs leading-relaxed outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                rows={5}
              />

              {promptTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {promptTags.map((tag, i) => (
                    <span key={i} className="text-[10px] bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md font-semibold border border-indigo-200/60 dark:border-indigo-800/40">
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Social Media Optimization Hint */}
              {socialSpecs && (
                <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900/50 text-xs space-y-1">
                  <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1 text-[11px]">
                    <ShieldCheck size={13} className="text-blue-600" /> Requisitos de Redes Sociales Aplicados:
                  </div>
                  <div className="text-[10px] text-blue-800 dark:text-blue-300 leading-snug">
                    • <strong>Zona Segura:</strong> {socialSpecs.safeZoneTip || 'Sujeto protegido de botones de app.'}
                  </div>
                  <div className="text-[10px] text-blue-800 dark:text-blue-300 leading-snug">
                    • <strong>Composición:</strong> {socialSpecs.compositionRule || 'Alto impacto visual en móvil.'}
                  </div>
                </div>
              )}
            </div>

            {/* Reference Image Picker */}
            <ImageReferencePicker
              referenceImage={referenceImage}
              onSelectReference={(url) => setReferenceImage(url)}
              availableImages={availableReferences}
              label="Imagen de Referencia Visual (Consistencia de Producto / Marca)"
              referenceEmailText={referenceEmailText}
              onUpdateEmailText={setReferenceEmailText}
            />

            {/* Architectural Photography Prompt Refiner Service Block */}
            <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 dark:from-slate-900/90 dark:via-indigo-950/40 dark:to-slate-900/90 rounded-xl border border-indigo-200/90 dark:border-indigo-900/60 p-3.5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Building2 size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      Prompt Refiner: Fotografía Arquitectónica Pro
                      <span className="text-[9px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold px-1.5 py-0.5 rounded-full">
                        Interceptor Backend
                      </span>
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Enriquece el prompt con ópticas tilt-shift, iluminación física e hipertexturas.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowArchDetails(!showArchDetails)}
                  className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 p-1"
                  title="Ver especificaciones técnicas"
                >
                  {showArchDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <select 
                  value={selectedArchTemplate}
                  onChange={e => setSelectedArchTemplate(e.target.value)}
                  className="flex-1 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800/60 rounded-lg p-2 text-xs font-medium outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-200 shadow-2xs"
                >
                  <option value="auto">⚡ Detección Automática por IA (según tu prompt)</option>
                  {ARCHITECTURAL_TEMPLATES.map(t => (
                    <option key={t.id} value={t.id}>
                      🏛️ {t.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleRefineWithArchitecturalTemplate}
                  disabled={isRefiningArch || !imagePrompt.trim()}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {isRefiningArch ? <Loader2 size={13} className="animate-spin" /> : <Wand2 size={13} />}
                  <span>Refinar</span>
                </button>
              </div>

              {/* Technical Specifications preview drawer */}
              {showArchDetails && (
                <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-900/40 text-[10px] space-y-1.5 text-slate-600 dark:text-slate-300 animate-in fade-in duration-200">
                  {(() => {
                    const current = selectedArchTemplate === 'auto'
                      ? promptRefiner.detectBestTemplate(imagePrompt, imageStyle)
                      : ARCHITECTURAL_TEMPLATES.find(t => t.id === selectedArchTemplate) || ARCHITECTURAL_TEMPLATES[0];
                    return (
                      <div className="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30 space-y-1">
                        <div className="font-bold text-indigo-700 dark:text-indigo-300 text-[11px] mb-1">
                          Parámetros Activos: {current.name}
                        </div>
                        <div><strong>📷 Óptica & Lente:</strong> {current.lensFocalLength}</div>
                        <div><strong>⚙️ Sensor & Apertura:</strong> {current.cameraSettings}</div>
                        <div><strong>💡 Esquema de Iluminación:</strong> {current.lighting}</div>
                        <div><strong>🧱 Micro-Texturas:</strong> {current.materialTextures}</div>
                        <div><strong>📐 Composición:</strong> {current.composition}</div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Estilo Visual Fotográfico:</label>
              <select 
                value={imageStyle}
                onChange={e => setImageStyle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-2.5 text-xs font-medium outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200"
              >
                <option value="Comercial & Producto 8K">Comercial & Producto 8K (Alta Definición)</option>
                <option value="Arquitectura & Espacios Modernos">Arquitectura & Espacios Modernos</option>
                <option value="Minimalista Editorial de Lujo">Minimalista Editorial de Lujo</option>
                <option value="Estudio Comercial con Softbox Difuso">Estudio Comercial con Softbox Difuso</option>
                <option value="Macro Detalle de Texturas">Macro Detalle de Texturas</option>
              </select>
            </div>

            {/* Format & Social Platform Matching */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Formato y Red Social:
                </label>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                  <span>Resolución:</span>
                  <button
                    type="button"
                    onClick={() => setImageResolution(imageResolution === '2K' ? '1K' : '2K')}
                    className={`font-bold px-1.5 py-0.5 rounded border text-[10px] ${
                      imageResolution === '2K' 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-gray-300'
                    }`}
                  >
                    {imageResolution} Ultra HD
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { ratio: '1:1', name: 'Feed 1:1', desc: 'Instagram / FB' },
                  { ratio: '9:16', name: 'Story / Reel', desc: 'TikTok / Shorts' },
                  { ratio: '16:9', name: 'Widescreen', desc: 'YouTube / Web' },
                  { ratio: '4:3', name: 'Catálogo', desc: 'Editorial' }
                ].map(item => (
                  <button
                    key={item.ratio}
                    type="button"
                    onClick={() => setImageRatio(item.ratio as any)}
                    className={`p-2 text-xs font-bold rounded-lg border transition-all text-center cursor-pointer ${
                      imageRatio === item.ratio 
                        ? 'bg-blue-50 border-blue-600 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 shadow-xs ring-1 ring-blue-500/30' 
                        : 'bg-slate-50 border-gray-200 dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-[11px] font-black">{item.name}</div>
                    <div className="text-[9px] font-medium opacity-75">{item.desc}</div>
                    <div className="text-[8px] font-mono opacity-50 mt-0.5">{item.ratio}</div>
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGenerateImage}
              disabled={isGeneratingImg || !imagePrompt.trim()}
              className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition-all cursor-pointer"
            >
              {isGeneratingImg ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Sintetizando píxeles HQ ({imageResolution}) con Gemini Imagen...</span>
                </>
              ) : (
                <>
                  <ImageIcon size={16} />
                  <span>Renderizar Imagen Publicitaria {imageResolution}</span>
                </>
              )}
            </button>
            
            {error && (
              <div className="text-xs text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-950/30 p-3 rounded-lg border border-red-200 dark:border-red-900/50">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right side: Preview & Saved Gallery */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-800 min-h-[420px] flex flex-col items-center justify-center">
            {generatedImg ? (
              <div className="w-full space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="relative group rounded-xl overflow-hidden shadow-md bg-black/5 dark:bg-black/40 border border-gray-200 dark:border-slate-800">
                  <img src={generatedImg} alt="Generada" className="w-full object-contain max-h-[480px] mx-auto rounded-lg" />
                  <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    {imageResolution} • {imageRatio}
                  </div>
                </div>
                {appliedPrompt && (
                  <div className="text-[10px] text-slate-500 font-mono p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-xs leading-relaxed space-y-1.5">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-700 dark:text-slate-300">Prompt de Difusión Final (Interceptado & Refinado):</strong>
                      <span className="text-[9px] bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={10} /> Prompt Refiner Activo
                      </span>
                    </div> 
                    <p className="line-clamp-4 hover:line-clamp-none transition-all">{appliedPrompt}</p>
                  </div>
                )}

                {appliedArchSpecs && (
                  <div className="p-3 bg-gradient-to-r from-indigo-50/80 to-blue-50/80 dark:from-indigo-950/40 dark:to-slate-800/80 rounded-lg border border-indigo-200 dark:border-indigo-900/50 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5 text-[11px]">
                        <Building2 size={13} className="text-indigo-600 dark:text-indigo-400" />
                        Óptica & Texturas Arquitectónicas ({appliedArchSpecs.templateName})
                      </span>
                      <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                        Plantilla Pro
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] text-slate-600 dark:text-slate-300 leading-snug">
                      <div><strong>📷 Lente & Sensor:</strong> {appliedArchSpecs.lensFocalLength}</div>
                      <div><strong>💡 Iluminación:</strong> {appliedArchSpecs.lighting}</div>
                      <div className="md:col-span-2"><strong>🧱 Materiales & Acabados:</strong> {appliedArchSpecs.materialTextures}</div>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => handleDownloadImage()} 
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-black dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                  >
                    <Download size={15} /> Descargar Imagen HQ ({imageResolution})
                  </button>
                  <button 
                    type="button"
                    onClick={() => setReferenceImage(generatedImg)}
                    className="px-3 py-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Layers size={14} /> Usar como Referencia
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 dark:text-slate-600 text-center space-y-3 flex flex-col items-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <ImageIcon size={32} className="opacity-50" />
                </div>
                <p className="text-sm font-medium">Tu render publicitario aparecerá aquí</p>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Escribe tu idea, presiona &ldquo;Mejorar Prompt con IA&rdquo; para optimizar composición e iluminación, y renderiza en 2K.
                </p>
              </div>
            )}
          </div>

          {/* Saved Gallery */}
          {savedHistory.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-800 shadow-sm space-y-3">
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>Imágenes Guardadas ({savedHistory.length})</span>
                <span className="text-[10px] text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Auto-guardadas
                </span>
              </h4>
              <div className="grid grid-cols-4 gap-2 max-h-[220px] overflow-y-auto p-1">
                {savedHistory.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      setGeneratedImg(item.url);
                      if (item.appliedPrompt) setAppliedPrompt(item.appliedPrompt);
                    }}
                    className={`group relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all aspect-square ${
                      generatedImg === item.url ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-gray-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    <img src={item.url} alt="Historial" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity text-white p-1 text-[9px]">
                      <span>Ver</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setReferenceImage(item.url);
                        }}
                        className="bg-blue-600 text-[8px] px-1 py-0.5 rounded"
                      >
                        Ref
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deep Prompt Fidelity Assistant Modal (ChatGPT / Gemini Pro) */}
      <PromptAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        type="image"
        currentPrompt={imagePrompt}
        referenceImage={referenceImage}
        referenceEmailText={referenceEmailText}
        aspectRatio={imageRatio}
        style={imageStyle}
        platform={imageRatio === '9:16' ? 'Instagram Reels & TikTok' : imageRatio === '1:1' ? 'Instagram & Facebook Feed' : 'YouTube & Web'}
        onApplyPrompt={(masterEnglish, enhancedSpanish, specs) => {
          setImagePrompt(masterEnglish);
          if (specs) setSocialSpecs(specs);
          setPromptTags(['Fidelidad de Referencia Bloqueada', 'Cámara 85mm f/2.8', 'Iluminación Softbox 3-Puntos', imageResolution + ' Ultra HD']);
        }}
      />
    </div>
  );
}

