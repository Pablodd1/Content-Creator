/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
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
  UserCheck,
  ShieldAlert,
  Wand2,
  Sliders,
  Video
} from 'lucide-react';
import { ToneOfVoice } from '../types';

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
  const [tone, setTone] = useState<ToneOfVoice>('Sales-driven');
  const [platform, setPlatform] = useState<string>('All Platforms');
  
  // Compliance and technical features toggles
  const [complianceFlags, setComplianceFlags] = useState<{
    nsr10: boolean;
    waterproof: boolean;
    fobShipping: boolean;
    catalogLink: boolean;
  }>({
    nsr10: true,
    waterproof: true,
    fobShipping: false,
    catalogLink: true
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isPromptCopied, setIsPromptCopied] = useState(false);

  const isSpanish = language === 'ES';

  // Quick testing presets
  const applyPreset = (presetType: 'metallic' | 'marble' | 'damask' | 'wood' | 'wholesale' | 'specs') => {
    if (presetType === 'metallic') {
      setTitle(isSpanish ? 'Lanzamiento Exclusivo PVC Metálico de Lujo' : 'Exclusive Luxury Metallic PVC Launch');
      setTarget(isSpanish ? 'Arquitectos, diseñadores de interiores y decoradores' : 'Architects, interior designers & decor studios');
      setObjective(isSpanish ? 'Captar leads comerciales y pedidos por volumen' : 'Capture high-ticket commercial leads and volume orders');
      setWant(isSpanish ? 'Enfocar en destellos dorados reflectivos y resistencia al desgaste' : 'Focus on reflective gold vein accents and high wear resistance');
      setTone('Luxury/Aspirational' as ToneOfVoice);
      setComplianceFlags({ nsr10: true, waterproof: true, fobShipping: false, catalogLink: true });
    } else if (presetType === 'marble') {
      setTitle(isSpanish ? 'Mármol Imperial 3D 100% Impermeable' : '100% Waterproof 3D Imperial Marble');
      setTarget(isSpanish ? 'Constructoras, hoteles y distribuidores mayoristas' : 'Construction firms, hotels & wholesale distributors');
      setObjective(isSpanish ? 'Promocionar despachos a Medellín, Bogotá, Cali y Barranquilla' : 'Promote direct port shipping to Bogota, Medellin & Cali');
      setWant(isSpanish ? 'Destacar el acabado hiperrealista de mármol Carrara sin mantenimiento' : 'Highlight maintenance-free hyper-realistic Carrara marble gloss');
      setTone('Sales-driven');
      setComplianceFlags({ nsr10: true, waterproof: true, fobShipping: true, catalogLink: true });
    } else if (presetType === 'damask') {
      setTitle(isSpanish ? 'Sofisticación Europea Damasco Clásico' : 'Classic European Damask Sophistication');
      setTarget(isSpanish ? 'Propietarios de residencias de lujo y boutiques' : 'Luxury residential homeowners & boutique hospitality');
      setObjective(isSpanish ? 'Impulsar visitas al showroom digital unitecusadesign.com' : 'Drive showroom visits to unitecusadesign.com');
      setWant(isSpanish ? 'Enfatizar textura táctil de hilo y elegancia atemporal' : 'Emphasize tactile thread relief and timeless elegance');
      setTone('Luxury/Aspirational' as ToneOfVoice);
      setComplianceFlags({ nsr10: false, waterproof: true, fobShipping: false, catalogLink: true });
    } else if (presetType === 'wood') {
      setTitle(isSpanish ? 'Paneles Acanalados de Madera PVC Lavables' : 'Washable Fluted Wood PVC Wall Panels');
      setTarget(isSpanish ? 'Diseñadores de locales comerciales y restaurantes' : 'Commercial retail & restaurant interior designers');
      setObjective(isSpanish ? 'Aumentar solicitudes de carpetas de muestras físicas' : 'Increase requests for physical sample binders');
      setWant(isSpanish ? 'Subrayar durabilidad de alto tráfico e instalación rápida' : 'Highlight high-traffic durability and fast installation');
      setTone('Informational');
      setComplianceFlags({ nsr10: true, waterproof: true, fobShipping: true, catalogLink: true });
    } else if (presetType === 'wholesale') {
      setTitle(isSpanish ? 'Distribución Mayorista Directa por Contenedor FOB' : 'Direct Wholesale Container FOB Distribution');
      setTarget(isSpanish ? 'Importadores, ferreterías grandes y distribuidores en Colombia' : 'Importers, large hardware chains & distributors in LATAM');
      setObjective(isSpanish ? 'Cerrar acuerdos de representación regional' : 'Close regional dealership & distribution agreements');
      setWant(isSpanish ? 'Mencionar despachos consolidados desde Miami / Cartagena' : 'Mention consolidated shipments from Miami / Cartagena ports');
      setTone('Sales-driven');
      setComplianceFlags({ nsr10: true, waterproof: true, fobShipping: true, catalogLink: true });
    } else {
      setTitle(isSpanish ? 'Cumplimiento Normativo Fuego NSR-10 y Ficha Técnica' : 'NSR-10 Fire Code Safety Compliance & Data Sheet');
      setTarget(isSpanish ? 'Directores de obra, interventores y auditores de construcción' : 'Site managers, construction auditors & engineers');
      setObjective(isSpanish ? 'Aprobar especificaciones técnicas en pliegos de licitación' : 'Get technical specifications approved for project bidding');
      setWant(isSpanish ? 'Adjuntar certificación de retardación de llama para fachadas internas' : 'Attach flame retardation certification for internal commercial walls');
      setTone('Informational');
      setComplianceFlags({ nsr10: true, waterproof: true, fobShipping: false, catalogLink: true });
    }
    showToast(isSpanish ? 'Preset aplicado exitosamente' : 'Preset brief loaded successfully');
  };

  // AI Brief Polish / Refiner
  const handlePolishBrief = () => {
    if (!title) setTitle(isSpanish ? 'Lanzamiento Revestimientos 3D de Lujo PVC' : 'Luxury 3D PVC Wall Cladding Launch');
    if (!target) setTarget(isSpanish ? 'Arquitectos, diseñadores de interiores y firmas de construcción' : 'Architects, interior designers & construction firms');
    if (!objective) setObjective(isSpanish ? 'Aumentar conversiones de venta al por mayor y pedidos directos' : 'Increase wholesale conversions and direct container orders');
    if (!want) setWant(isSpanish ? 'Enfocar en acabado 100% impermeable, norma NSR-10 y textura europea de unitecusadesign.com' : 'Focus on 100% waterproof finish, NSR-10 standard, and European texture at unitecusadesign.com');
    
    showToast(isSpanish ? 'Breviario optimizado con vocabulario técnico de diseño' : 'Brief polished with interior design terminology');
  };

  const handleGenerate = async () => {
    if (!title && !target && !objective && !want) {
      showToast(isSpanish ? 'Por favor completa al menos un campo para generar' : 'Please fill out at least one field to generate');
      return;
    }

    setIsGenerating(true);

    const activeComplianceList = [];
    if (complianceFlags.nsr10) activeComplianceList.push(isSpanish ? 'Norma de retardación al fuego NSR-10 para interiores' : 'NSR-10 Fire Retardation Standard');
    if (complianceFlags.waterproof) activeComplianceList.push(isSpanish ? '100% Impermeable, lavable y anti-humedad' : '100% Waterproof, Washable & Anti-Moisture');
    if (complianceFlags.fobShipping) activeComplianceList.push(isSpanish ? 'Despachos mayoristas por contenedor completo FOB (Cartagena/Buenaventura/Miami)' : 'Full Container Wholesale FOB Shipping (Miami/Cartagena)');
    if (complianceFlags.catalogLink) activeComplianceList.push('Sitio web oficial: unitecusadesign.com');

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
          tone,
          platform,
          complianceFlags: activeComplianceList,
          language
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedPost(data.text);
        showToast(isSpanish ? '¡Publicación profesional optimizada generada!' : 'Optimized professional post generated successfully!');
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (err: any) {
      console.error(err);
      showToast(isSpanish ? 'Simulando respuesta con Gemini 2.5...' : 'Simulating response with Gemini 2.5...');
      simulateFallbackPost();
    } finally {
      setIsGenerating(false);
    }
  };

  const simulateFallbackPost = () => {
    const header = title ? `✨ ${title.toUpperCase()} ✨` : (isSpanish ? '✨ DISEÑO PREMIUM PVC WALLPAPER • UNITEC USA ✨' : '✨ PREMIUM PVC WALLPAPER DESIGN • UNITEC USA ✨');
    
    const fallbackText = isSpanish 
      ? `✨ [CAPTURE HOOK / HEADLINE]
${header}

📖 [MAIN POST BODY]
¿Buscas transformar espacios comerciales y residenciales con sofisticación europea atemporal? 🚀

Presentamos la colección de Revestimientos 3D y Papel Tapiz PVC de Alta Gama de UNITEC USA Design. Diseñados con relieves táctiles de textura impecable, acabados reflectivos de lujo y durabilidad garantizada para proyectos de alto tráfico.

• Muros 100% impermeables, lavables y resistentes al moho o la humedad.
• Diseños exclusivos importados ideales para salas de estar, suites de hotel, oficinas ejecutivas y locales comerciales.
• Soluciones de fácil instalación autoadhesiva y alto impacto visual.

🔒 [TECHNICAL & COMPLIANCE SPECIFICATIONS]
✓ Cumplimiento de la norma técnica de retardación al fuego NSR-10 para fachadas internas.
✓ Materiales certificados de polímero de PVC de alta densidad y durabilidad industrial.
${complianceFlags.fobShipping ? '✓ Despachos consolidados por contenedor completo (FOB Miami / Cartagena / Buenaventura).' : ''}

🎯 [CALL TO ACTION]
Explore el catálogo digital completo y solicite muestras físicas para sus proyectos en 🔗 unitecusadesign.com o contáctenos para asesoría personalizada.

🎬 [PAIRED AI VISUAL ASSET PROMPT (Runway / Midjourney)]
High-definition 8k hyper-realistic interior photography of a luxury living room wall featuring UNITEC USA Design's ${title || 'metallic PVC wallpaper'}. Warm showroom lighting, macro depth-of-field showcasing intricate 3D embossed textures, gold leaf accents, cinematic architectural detail, 16:9 aspect ratio.

🏷️ [HASHTAGS]
#UnitecUSA #PVCWallpaper #DisenoInterior #ArquitecturaColombia #PapelTapizDeLujo #InteriorismoMedellin #DecoracionBogota #ConstruccionSostenible #NSR10 #WallCladding #ShowroomMiami`
      : `✨ [CAPTURE HOOK / HEADLINE]
${header}

📖 [MAIN POST BODY]
Ready to elevate your architectural interiors with high-end European elegance? 🚀

Introducing UNITEC USA Design's luxury PVC wallpaper and 3D wall cladding collections. Engineered with tactile embossed textures, premium metallic accents, and commercial-grade durability for high-impact spaces.

• 100% waterproof, washable, and zero moisture retention.
• Ideal for luxury residential walls, executive suites, and commercial hospitality.
• Swift installation with zero compromise on visual luxury.

🔒 [TECHNICAL & COMPLIANCE SPECIFICATIONS]
✓ Certified fire retardation standards for internal commercial walls.
✓ High-density PVC polymer composite material.
${complianceFlags.fobShipping ? '✓ Direct FOB container logistics from Miami and main ports.' : ''}

🎯 [CALL TO ACTION]
Browse our exclusive digital catalog and order project sample boards today at 🔗 unitecusadesign.com.

🎬 [PAIRED AI VISUAL ASSET PROMPT (Runway / Midjourney)]
High-definition 8k hyper-realistic interior photography of a modern executive suite wall with UNITEC USA Design's ${title || 'luxury PVC wallpaper'}. Warm architectural spotlighting, close-up macro showing rich tactile embossing, cinematic commercial advertising shot, 16:9 ratio.

🏷️ [HASHTAGS]
#UnitecUSA #LuxuryWallpaper #InteriorDesign #ArchitectureColombia #CommercialInteriors #WallCladding #PremiumPVC #ShowroomMiami #WholesaleWallpapers`;

    setGeneratedPost(fallbackText);
  };

  const handleCopy = () => {
    if (!generatedPost) return;
    navigator.clipboard.writeText(generatedPost);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    showToast(isSpanish ? 'Publicación copiada al portapapeles' : 'Post copied to clipboard');
  };

  // Extract visual prompt section specifically
  const extractVisualPrompt = (): string => {
    if (!generatedPost) return '';
    const match = generatedPost.match(/🎬 \[PAIRED AI VISUAL ASSET PROMPT[^\]]*\]\n([\s\S]*?)(?=\n\n🏷️|\n\n🎯|$)/);
    if (match && match[1]) {
      return match[1].trim();
    }
    return 'High-definition 8k hyper-realistic interior photo of UNITEC USA Design luxury PVC wallpaper with warm showroom lighting.';
  };

  const handleCopyVisualPrompt = () => {
    const promptText = extractVisualPrompt();
    navigator.clipboard.writeText(promptText);
    setIsPromptCopied(true);
    setTimeout(() => setIsPromptCopied(false), 2000);
    showToast(isSpanish ? 'Prompt visual de IA copiado para Runway/Midjourney' : 'AI Visual Prompt copied for Runway/Midjourney');
  };

  return (
    <div id="unified-social-post-playground" className="bg-white border border-[#e5e5df] rounded-xl text-[#1a1a1a] shadow-sm overflow-hidden flex flex-col mt-6">
      {/* Banner Header */}
      <div className="bg-[#2d5a4a] p-5 text-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-1.5 bg-[#c9a961] text-stone-950 font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded">
            <Sparkles size={9} className="animate-spin" />
            {isSpanish ? 'GEMINI 2.5 • GENERADOR INDIVIDUAL SOBRE DEMANDA' : 'GEMINI 2.5 • ON-DEMAND CREATIVE GENERATOR'}
          </div>
          <h3 className="text-sm font-sans font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText size={18} className="text-[#c9a961]" />
            {isSpanish ? 'Estudio de Prompting & Creación de Campaña' : 'Prompting Studio & Single Campaign Creator'}
          </h3>
          <p className="text-[10px] text-stone-200 font-sans">
            {isSpanish 
              ? 'Genere publicaciones únicas altamente personalizadas con tono estratégico, parámetros técnicos y prompts de IA pareados' 
              : 'Generate custom campaign posts with strategic tone, technical compliance, and paired AI prompts'}
          </p>
        </div>

        {/* Industry Presets Quick-Deck */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[9px] font-mono uppercase font-extrabold text-[#c9a961] mr-1">
            {isSpanish ? 'PRESETS DE INDUSTRIA:' : 'INDUSTRY PRESETS:'}
          </span>
          <button 
            onClick={() => applyPreset('metallic')}
            className="px-2 py-1 bg-stone-900/50 hover:bg-stone-900/80 text-stone-200 text-[10px] rounded border border-white/10 transition-colors cursor-pointer"
          >
            {isSpanish ? 'Metálico' : 'Metallic'}
          </button>
          <button 
            onClick={() => applyPreset('marble')}
            className="px-2 py-1 bg-stone-900/50 hover:bg-stone-900/80 text-stone-200 text-[10px] rounded border border-white/10 transition-colors cursor-pointer"
          >
            {isSpanish ? 'Mármol 3D' : '3D Marble'}
          </button>
          <button 
            onClick={() => applyPreset('damask')}
            className="px-2 py-1 bg-stone-900/50 hover:bg-stone-900/80 text-stone-200 text-[10px] rounded border border-white/10 transition-colors cursor-pointer"
          >
            Damasco
          </button>
          <button 
            onClick={() => applyPreset('wood')}
            className="px-2 py-1 bg-stone-900/50 hover:bg-stone-900/80 text-stone-200 text-[10px] rounded border border-white/10 transition-colors cursor-pointer"
          >
            {isSpanish ? 'Madera' : 'Wood'}
          </button>
          <button 
            onClick={() => applyPreset('wholesale')}
            className="px-2 py-1 bg-[#c9a961] text-stone-950 font-bold text-[10px] rounded transition-colors cursor-pointer"
          >
            {isSpanish ? 'Contenedores' : 'Wholesale'}
          </button>
          <button 
            onClick={() => applyPreset('specs')}
            className="px-2 py-1 bg-stone-900/50 hover:bg-stone-900/80 text-stone-200 text-[10px] rounded border border-white/10 transition-colors cursor-pointer"
          >
            {isSpanish ? 'Ficha NSR-10' : 'NSR-10 Code'}
          </button>
        </div>
      </div>

      {/* Main Spacious Desktop Grid Layout (12 cols) */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Brief Input Controls Deck (6 cols on desktop) */}
        <div className="lg:col-span-6 space-y-4 text-left">
          
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-[11px] font-mono uppercase font-black text-stone-800 flex items-center gap-1.5">
              <Sliders size={13} className="text-[#c9a961]" />
              {isSpanish ? '1. Breviario Creativo & Variables' : '1. Creative Brief Variables'}
            </span>
            <button
              onClick={handlePolishBrief}
              className="text-[10px] text-[#2d5a4a] hover:text-[#1e3f34] font-bold font-mono flex items-center gap-1 cursor-pointer hover:underline"
              title={isSpanish ? 'Completar con terminología técnica de arquitectura' : 'Auto-fill with architectural terms'}
            >
              <Wand2 size={11} className="text-[#c9a961]" />
              <span>{isSpanish ? 'Pulir con IA' : 'Refine Brief'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Title */}
            <div className="space-y-1">
              <label htmlFor="post-title-input" className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-stone-600 font-extrabold">
                <Lightbulb size={11} className="text-[#c9a961]" />
                {isSpanish ? 'Título / Gancho Principal:' : 'Title / Main Hook Line:'}
              </label>
              <input 
                id="post-title-input"
                type="text"
                placeholder={isSpanish ? 'Ej: Lanzamiento PVC Metálico Lujo' : 'e.g. Luxury Metallic PVC Launch'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#2d5a4a] text-stone-900 text-xs rounded px-3 py-2 outline-none transition-all font-sans"
              />
            </div>

            {/* Target */}
            <div className="space-y-1">
              <label htmlFor="post-target-input" className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-stone-600 font-extrabold">
                <Target size={11} className="text-[#c9a961]" />
                {isSpanish ? 'Audiencia / Segmento:' : 'Target Segment:'}
              </label>
              <input 
                id="post-target-input"
                type="text"
                placeholder={isSpanish ? 'Ej: Arquitectos e interioristas en Medellín' : 'e.g. Premium interiorists in LATAM'}
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#2d5a4a] text-stone-900 text-xs rounded px-3 py-2 outline-none transition-all font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Objective */}
            <div className="space-y-1">
              <label htmlFor="post-objective-input" className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-stone-600 font-extrabold">
                <UserCheck size={11} className="text-[#c9a961]" />
                {isSpanish ? 'Objetivo Estratégico:' : 'Strategic Goal:'}
              </label>
              <input 
                id="post-objective-input"
                type="text"
                placeholder={isSpanish ? 'Ej: Impulsar venta por contenedor' : 'e.g. Schedule digital catalog demo'}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#2d5a4a] text-stone-900 text-xs rounded px-3 py-2 outline-none transition-all font-sans"
              />
            </div>

            {/* Want (Specific details) */}
            <div className="space-y-1">
              <label htmlFor="post-want-input" className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-stone-600 font-extrabold">
                <Globe size={11} className="text-[#c9a961]" />
                {isSpanish ? 'Ángulo Creativo / Detalle:' : 'Creative Focus / Angle:'}
              </label>
              <input 
                id="post-want-input"
                type="text"
                placeholder={isSpanish ? 'Ej: Resaltar relieve 3D y brillo' : 'e.g. Highlight 3D embossed texture'}
                value={want}
                onChange={(e) => setWant(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#2d5a4a] text-stone-900 text-xs rounded px-3 py-2 outline-none transition-all font-sans"
              />
            </div>
          </div>

          {/* Tone & Platform Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-600 font-extrabold">
                🗣️ {isSpanish ? 'Tono de Comunicación:' : 'Tone of Voice:'}
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as ToneOfVoice)}
                className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-xs text-stone-850 focus:outline-[#2d5a4a]"
              >
                <option value="Sales-driven">{isSpanish ? 'Venta Comercial Persuasiva' : 'Sales-driven & High Conversion'}</option>
                <option value="Informational">{isSpanish ? 'Técnico & Arquitectónico' : 'Technical & Architectural'}</option>
                <option value="Community-centric">{isSpanish ? 'Inspiracional & Estilo de Vida' : 'Inspirational & Lifestyle'}</option>
                <option value="Luxury/Aspirational">{isSpanish ? 'Aspiracional de Lujo / Showroom' : 'Luxury & Showroom Aesthetic'}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-600 font-extrabold">
                📱 {isSpanish ? 'Plataforma Objetivo:' : 'Target Platform:'}
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-xs text-stone-850 focus:outline-[#2d5a4a]"
              >
                <option value="All Platforms">{isSpanish ? 'Todas las Redes (Unificado)' : 'All Platforms (Unified)'}</option>
                <option value="Instagram Reels & Post">Instagram Reels & Carousel</option>
                <option value="LinkedIn B2B Wholesale">LinkedIn B2B Commercial</option>
                <option value="Facebook Ad Campaign">Facebook Ad Campaign</option>
                <option value="YouTube Shorts Script">YouTube Shorts Video Script</option>
              </select>
            </div>
          </div>

          {/* Technical Compliance & Product Features Toggles */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 space-y-2">
            <span className="block text-[10px] uppercase font-mono tracking-wider text-stone-700 font-extrabold flex items-center gap-1.5">
              <ShieldAlert size={12} className="text-[#2d5a4a]" />
              {isSpanish ? '2. Inclusión de Normativa & Ficha Técnica:' : '2. Technical & Compliance Requirements:'}
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px] font-sans">
              <label className="flex items-center gap-2 cursor-pointer text-stone-800 hover:text-black">
                <input 
                  type="checkbox"
                  checked={complianceFlags.nsr10}
                  onChange={(e) => setComplianceFlags(prev => ({ ...prev, nsr10: e.target.checked }))}
                  className="accent-[#2d5a4a] rounded cursor-pointer"
                />
                <span>{isSpanish ? 'Norma de Fuego NSR-10' : 'NSR-10 Fire Code'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-stone-800 hover:text-black">
                <input 
                  type="checkbox"
                  checked={complianceFlags.waterproof}
                  onChange={(e) => setComplianceFlags(prev => ({ ...prev, waterproof: e.target.checked }))}
                  className="accent-[#2d5a4a] rounded cursor-pointer"
                />
                <span>{isSpanish ? '100% Impermeable PVC' : '100% Waterproof PVC'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-stone-800 hover:text-black">
                <input 
                  type="checkbox"
                  checked={complianceFlags.fobShipping}
                  onChange={(e) => setComplianceFlags(prev => ({ ...prev, fobShipping: e.target.checked }))}
                  className="accent-[#2d5a4a] rounded cursor-pointer"
                />
                <span>{isSpanish ? 'Envíos Contenedor FOB' : 'FOB Container Logistics'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-stone-800 hover:text-black">
                <input 
                  type="checkbox"
                  checked={complianceFlags.catalogLink}
                  onChange={(e) => setComplianceFlags(prev => ({ ...prev, catalogLink: e.target.checked }))}
                  className="accent-[#2d5a4a] rounded cursor-pointer"
                />
                <span>{isSpanish ? 'Enlace unitecusadesign.com' : 'unitecusadesign.com Link'}</span>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              id="generate-universal-post-btn"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-[#c9a961] font-sans font-black uppercase text-xs tracking-wider rounded-lg transition-all shadow-sm hover:shadow-md cursor-pointer disabled:bg-stone-200 disabled:text-stone-400 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>{isSpanish ? 'COMPILANDO CON GEMINI 2.5...' : 'COMPILING WITH GEMINI 2.5...'}</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>{isSpanish ? 'Generar Campaña Creativa Optimizada' : 'Generate Optimized Campaign Post'}</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Column: Generated Output Deck (6 cols on desktop) */}
        <div className="lg:col-span-6 bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col justify-between min-h-[420px]">
          {generatedPost ? (
            <div className="space-y-3.5 flex flex-col justify-between h-full text-left">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-[10px] font-mono uppercase font-black text-[#2d5a4a] bg-[#2d5a4a]/10 border border-[#2d5a4a]/25 px-2.5 py-1 rounded flex items-center gap-1.5">
                  <Sparkles size={11} className="text-[#c9a961]" />
                  {isSpanish ? 'Campana Única Generada (Gemini 2.5)' : 'Unified Campaign Draft (Gemini 2.5)'}
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyVisualPrompt}
                    className="p-1.5 bg-white border border-stone-200 text-stone-700 hover:text-black rounded transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-sans font-bold"
                    title={isSpanish ? 'Copiar prompt para Runway/Midjourney' : 'Copy prompt for Runway/Midjourney'}
                  >
                    <Video size={12} className="text-[#c9a961]" />
                    <span>{isPromptCopied ? (isSpanish ? '¡Prompt Copiado!' : 'Prompt Copied!') : (isSpanish ? 'Copiar Prompt Video' : 'Copy Visual Prompt')}</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="p-1.5 bg-stone-900 text-white hover:bg-stone-800 rounded transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-sans font-bold"
                    title={isSpanish ? 'Copiar publicación completa' : 'Copy complete post'}
                  >
                    {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{isCopied ? (isSpanish ? '¡Copiado!' : 'Copied!') : (isSpanish ? 'Copiar Todo' : 'Copy All')}</span>
                  </button>
                </div>
              </div>

              {/* Formatted Output Box */}
              <div className="bg-white p-4 rounded-lg border border-stone-200 text-xs text-stone-800 font-sans leading-relaxed whitespace-pre-wrap max-h-[360px] overflow-y-auto select-all shadow-xs">
                {generatedPost}
              </div>

              <div className="text-[9px] font-mono text-stone-500 text-center pt-2 border-t leading-tight flex justify-between items-center">
                <span>{isSpanish ? '※ Estructurado con secciones de Gancho, Texto, Ficha Técnica y Hashtags.' : '※ Formatted with Hook, Body, Specs, and Hashtag blocks.'}</span>
                <span className="text-[#2d5a4a] font-bold">unitecusadesign.com</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-stone-400 text-center space-y-3">
              <div className="p-3 bg-[#c9a961]/10 rounded-full border border-[#c9a961]/30">
                <Lightbulb size={36} className="text-[#c9a961] animate-pulse" />
              </div>
              <h4 className="font-sans font-extrabold text-stone-800 text-xs uppercase tracking-wider">
                {isSpanish ? 'Estudio Creativo Listo' : 'Creative Studio Ready'}
              </h4>
              <p className="text-[11px] text-stone-500 max-w-xs leading-relaxed">
                {isSpanish 
                  ? 'Seleccione un preset de la industria o configure los parámetros del breviario para compilar una campaña sobre demanda con Gemini 2.5' 
                  : 'Select an industry preset or set brief parameters to compile an on-demand campaign with Gemini 2.5'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

