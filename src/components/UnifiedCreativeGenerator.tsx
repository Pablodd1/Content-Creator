/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  FileText, 
  Target, 
  Lightbulb,
  Globe,
  RefreshCw,
  UserCheck
} from 'lucide-react';

interface UnifiedCreativeGeneratorProps {
  language: 'EN' | 'ES';
  showToast: (msg: string) => void;
}

export default function UnifiedCreativeGenerator({
  language,
  showToast
}: UnifiedCreativeGeneratorProps) {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [objective, setObjective] = useState('');
  const [want, setWant] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const isSpanish = language === 'ES';

  // Quick testing presets
  const applyPreset = (presetType: 'metallic' | 'marble' | 'damask') => {
    if (presetType === 'metallic') {
      setTitle(isSpanish ? 'La elegancia del PVC Metálico' : 'Luxury Metallic PVC Elegance');
      setTarget(isSpanish ? 'Arquitectos e interioristas en Medellín' : 'Architects & interior designers in Medellin');
      setObjective(isSpanish ? 'Generar leads para venta por contenedor' : 'Generate container-bulk distribution leads');
      setWant(isSpanish ? 'Enfocar en retardación al fuego NSR-10 y diseño de vetas doradas unitecusadesign.com' : 'Highlight fire-retarding NSR-10 compliance and gold leaf veins at unitecusadesign.com');
    } else if (presetType === 'marble') {
      setTitle(isSpanish ? 'Mármol Imperial 3D Sin Humedad' : 'Impermeable 3D Imperial Marble');
      setTarget(isSpanish ? 'Distribuidores mayoristas y constructores' : 'Wholesale distributors and premium builders');
      setObjective(isSpanish ? 'Promocionar envío express a Bogotá y Cali' : 'Promote express shipping to Bogota & Cali ports');
      setWant(isSpanish ? 'Destacar el acabado ultra-realista brillante de mármol Carrara resistente al agua' : 'Accentuate ultra-realistic high-gloss waterproof Carrara marble finishes');
    } else {
      setTitle(isSpanish ? 'Estilo Europeo Clásico Damasco' : 'Classic European Damask Style');
      setTarget(isSpanish ? 'Propietarios de viviendas de lujo en Cartagena' : 'Luxury residential homeowners in Cartagena');
      setObjective(isSpanish ? 'Aumentar visitas al showroom online' : 'Drive premium traffic to our digital catalog');
      setWant(isSpanish ? 'Transmitir sofisticación con relieves de hilo táctiles de alta durabilidad' : 'Convey high sophistication with premium high-durability tactile thread textures');
    }
    showToast(isSpanish ? 'Preset de prueba aplicado con éxito' : 'Test preset applied successfully');
  };

  const handleGenerate = async () => {
    if (!title && !target && !objective && !want) {
      showToast(isSpanish ? 'Por favor completa al menos un campo' : 'Please fill out at least one input field');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-universal-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          target,
          objective,
          want,
          language
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedPost(data.text);
        showToast(isSpanish ? '¡Publicación creativa generada!' : 'Creative post generated successfully!');
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (err: any) {
      console.error(err);
      // Fallback response simulation if API key is not configured or in sandbox offline mode
      showToast(isSpanish ? 'Simulando respuesta (Servidor ocupado o sin clave)' : 'Simulating render (Server offline/no API Key)');
      simulateFallbackPost();
    } finally {
      setIsGenerating(false);
    }
  };

  const simulateFallbackPost = () => {
    const header = title ? `✨ ${title.toUpperCase()} ✨` : (isSpanish ? '✨ DISEÑO PREMIUM PVC WALLPAPER ✨' : '✨ PREMIUM PVC WALLPAPER DESIGN ✨');
    const audienceStr = target ? (isSpanish ? `Diseñado para: ${target}` : `Optimized for: ${target}`) : '';
    const objStr = objective ? (isSpanish ? `Objetivo Estratégico: ${objective}` : `Strategic Goal: ${objective}`) : '';
    
    const fallbackText = isSpanish 
      ? `${header}
      
¿Listo para transformar tus espacios interiores con la calidad premium de UNITEC USA? 🚀

Muros sofisticados, 100% lavables e impermeables que cumplen con la norma estacional NSR-10 de retardación al fuego. Ideal para proyectos residenciales y comerciales de alto impacto.

${audienceStr ? `📍 ${audienceStr}` : ''}
${objStr ? `🎯 ${objStr}` : ''}
${want ? `💡 Ángulo Creativo: ${want}` : ''}

Descubre todo el catálogo exclusivo en 🔗 unitecusadesign.com o agenda una asesoría personalizada hoy mismo.

#UnitecUSA #PVCWallpaper #DisenoInterior #DecoracionMedellin #ArquitecturaColombia #PapelTapizDeLujo #Interiorismo #ConstruccionSostenible`
      : `${header}

Elevate your interior design projects with the premium durability of UNITEC USA Wallpapers! 🚀

100% waterproof, washable PVC wall solutions with certified NSR-10 fire retardation standards. European-designed textures customized for absolute quality.

${audienceStr ? `📍 ${audienceStr}` : ''}
${objStr ? `🎯 ${objStr}` : ''}
${want ? `💡 Specific Focus: ${want}` : ''}

Browse our complete bulk catalog and request sample boards today at 🔗 unitecusadesign.com.

#UnitecUSA #LuxuryWallpaper #InteriorDesign #ArchitectureColombia #CommercialDesign #PremiumPVC #WallCladding #ShowroomMiami`;

    setGeneratedPost(fallbackText);
  };

  const handleCopy = () => {
    if (!generatedPost) return;
    navigator.clipboard.writeText(generatedPost);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    showToast(isSpanish ? 'Copiado al portapapeles' : 'Copied to clipboard');
  };

  return (
    <div id="unified-social-post-playground" className="bg-white border border-[#e5e5df] rounded-xl text-[#1a1a1a] shadow-sm overflow-hidden flex flex-col mt-6">
      {/* Banner Header */}
      <div className="bg-[#2d5a4a] p-5 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-1.5 bg-[#c9a961] text-stone-950 font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded">
            <Sparkles size={9} className="animate-spin" />
            {isSpanish ? 'GENERADOR MULTI-CANAL UNIFICADO' : 'UNIFIED CROSS-PLATFORM GENERATOR'}
          </div>
          <h3 className="text-sm font-sans font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText size={18} className="text-[#c9a961]" />
            {isSpanish ? 'Creador de Publicación Única Creativa' : 'Single Creative Cross-Media Post Creator'}
          </h3>
          <p className="text-[10px] text-stone-200 font-sans">
            {isSpanish 
              ? 'Genere una sola campaña creativa para todas las redes sociales completando los campos de prueba' 
              : 'Generate one unified creative social campaign optimized for all platforms instantly'}
          </p>
        </div>

        {/* Tester Preset Quick-Deck */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[9px] font-mono uppercase font-extrabold text-[#c9a961] mr-1">
            {isSpanish ? 'PROBAR CON:' : 'TEST PRESET:'}
          </span>
          <button 
            onClick={() => applyPreset('metallic')}
            className="px-2 py-1 bg-stone-900/40 hover:bg-stone-900/60 text-stone-200 text-[10px] rounded border border-white/10 transition-colors cursor-pointer"
          >
            {isSpanish ? 'Metálico' : 'Metallic'}
          </button>
          <button 
            onClick={() => applyPreset('marble')}
            className="px-2 py-1 bg-stone-900/40 hover:bg-stone-900/60 text-stone-200 text-[10px] rounded border border-white/10 transition-colors cursor-pointer"
          >
            {isSpanish ? 'Mármol' : 'Marble'}
          </button>
          <button 
            onClick={() => applyPreset('damask')}
            className="px-2 py-1 bg-stone-900/40 hover:bg-stone-900/60 text-stone-200 text-[10px] rounded border border-white/10 transition-colors cursor-pointer"
          >
            Damasco
          </button>
        </div>
      </div>

      {/* Main Core Body Grid Layout */}
      <div className="p-5 flex flex-col lg:flex-row gap-6">
        
        {/* Input Fields Deck */}
        <div className="flex-1 space-y-4 max-w-xl text-left">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1">
              <label htmlFor="post-title-input" className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-stone-500 font-extrabold">
                <Lightbulb size={11} className="text-[#c9a961]" />
                {isSpanish ? 'Título / Gancho Hook:' : 'Title / Hook Line:'}
              </label>
              <input 
                id="post-title-input"
                type="text"
                placeholder={isSpanish ? 'Ej: Lanzamiento PVC Metálico Lujo' : 'e.g. Luxury Metallic PVC Launch'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#2d5a4a] text-stone-850 text-xs rounded px-3 py-2 outline-none transition-all"
              />
            </div>

            {/* Target */}
            <div className="space-y-1">
              <label htmlFor="post-target-input" className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-stone-500 font-extrabold">
                <Target size={11} className="text-[#c9a961]" />
                {isSpanish ? 'Target / Segmento Clave:' : 'Target Audience / Segment:'}
              </label>
              <input 
                id="post-target-input"
                type="text"
                placeholder={isSpanish ? 'Ej: Diseñadores en Medellín y Cali' : 'e.g. Premium interiorists in Colombia'}
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#2d5a4a] text-stone-850 text-xs rounded px-3 py-2 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Objective */}
            <div className="space-y-1">
              <label htmlFor="post-objective-input" className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-stone-500 font-extrabold">
                <UserCheck size={11} className="text-[#c9a961]" />
                {isSpanish ? 'Objetivo / Acción Deseada:' : 'Objective / Strategy Call:'}
              </label>
              <input 
                id="post-objective-input"
                type="text"
                placeholder={isSpanish ? 'Ej: Promover visitas al showroom digital' : 'e.g. Schedule digital catalog demo'}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#2d5a4a] text-stone-850 text-xs rounded px-3 py-2 outline-none transition-all"
              />
            </div>

            {/* Want (Specific details) */}
            <div className="space-y-1">
              <label htmlFor="post-want-input" className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-stone-500 font-extrabold">
                <Globe size={11} className="text-[#c9a961]" />
                {isSpanish ? 'Want / Requisito / Detalle:' : 'Want / Requirement / Focus:'}
              </label>
              <input 
                id="post-want-input"
                type="text"
                placeholder={isSpanish ? 'Ej: Mencionar impermeabilidad y NSR-10' : 'e.g. Highlight NSR-10 fire standard'}
                value={want}
                onChange={(e) => setWant(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#2d5a4a] text-stone-850 text-xs rounded px-3 py-2 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              id="generate-universal-post-btn"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-[#c9a961] font-sans font-black uppercase text-xs tracking-wider rounded-lg transition-all shadow-sm hover:shadow-md cursor-pointer disabled:bg-stone-200 disabled:text-stone-400 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  <span>{isSpanish ? 'COMPILANDO CON GEMINI...' : 'COMPILING WITH GEMINI...'}</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>{isSpanish ? 'Generar Publicación Creativa Única' : 'Generate Universal Creative Post'}</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Display / Output Box Deck */}
        <div className="flex-1 bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col justify-between min-h-[220px]">
          {generatedPost ? (
            <div className="space-y-3.5 flex flex-col justify-between h-full text-left">
              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-[10px] font-mono uppercase font-black text-[#2d5a4a] bg-[#2d5a4a]/5 border border-[#2d5a4a]/25 px-2 py-0.5 rounded">
                  ✨ {isSpanish ? 'Post Único de Redes Sociales' : 'Unified Cross-Media Creative Output'}
                </span>
                
                <button
                  onClick={handleCopy}
                  className="p-1 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-sans font-bold"
                  title={isSpanish ? 'Copiar al portapapeles' : 'Copy output draft'}
                >
                  {isCopied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{isCopied ? (isSpanish ? '¡Copiado!' : 'Copied!') : (isSpanish ? 'Copiar' : 'Copy')}</span>
                </button>
              </div>

              <div className="bg-white p-3.5 rounded border border-stone-200 text-xs text-stone-750 font-sans leading-relaxed whitespace-pre-wrap max-h-[250px] overflow-y-auto select-all">
                {generatedPost}
              </div>

              <div className="text-[8.5px] font-mono text-stone-450 italic text-center pt-1 border-t leading-tight">
                {isSpanish 
                  ? '※ Optimizado automáticamente para alto engagement en Instagram, Facebook, LinkedIn y YouTube.' 
                  : '※ Automatically formatted for maximal b2b/b2c impact on Instagram, Facebook, LinkedIn, & YouTube.'}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-stone-400 text-center space-y-2">
              <Lightbulb size={36} className="text-[#c9a961] animate-pulse" />
              <h4 className="font-sans font-bold text-stone-700 text-xs uppercase tracking-wider">
                {isSpanish ? 'Esperando Parámetros' : 'Awaiting Post Variables'}
              </h4>
              <p className="text-[10.5px] text-stone-500 max-w-xs leading-relaxed">
                {isSpanish 
                  ? 'Complete los campos o presione un preset de prueba para generar instantáneamente su publicación creativa única' 
                  : 'Fill the text inputs or press one of the quick test options to render your cross-platform post'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
