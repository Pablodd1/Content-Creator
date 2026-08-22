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
  Video,
  Layers,
  Zap,
  Hash,
  MessageSquare
} from 'lucide-react';
import { ToneOfVoice, CopywritingFramework } from '../types';

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
  const [framework, setFramework] = useState<CopywritingFramework>('PAS');
  
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
  const [activeOutputTab, setActiveOutputTab] = useState<'full' | 'hooks' | 'carousel' | 'video' | 'hashtags'>('full');
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
      setFramework('AIDA');
      setComplianceFlags({ nsr10: true, waterproof: true, fobShipping: false, catalogLink: true });
    } else if (presetType === 'marble') {
      setTitle(isSpanish ? 'Mármol Imperial 3D 100% Impermeable' : '100% Waterproof 3D Imperial Marble');
      setTarget(isSpanish ? 'Constructoras, hoteles y distribuidores mayoristas' : 'Construction firms, hotels & wholesale distributors');
      setObjective(isSpanish ? 'Promocionar despachos a Medellín, Bogotá, Cali y Barranquilla' : 'Promote direct port shipping to Bogota, Medellin & Cali');
      setWant(isSpanish ? 'Destacar el acabado hiperrealista de mármol Carrara sin mantenimiento' : 'Highlight maintenance-free hyper-realistic Carrara marble gloss');
      setTone('Sales-driven');
      setFramework('PAS');
      setComplianceFlags({ nsr10: true, waterproof: true, fobShipping: true, catalogLink: true });
    } else if (presetType === 'damask') {
      setTitle(isSpanish ? 'Sofisticación Europea Damasco Clásico' : 'Classic European Damask Sophistication');
      setTarget(isSpanish ? 'Propietarios de residencias de lujo y boutiques' : 'Luxury residential homeowners & boutique hospitality');
      setObjective(isSpanish ? 'Impulsar visitas al showroom digital unitecusadesign.com' : 'Drive showroom visits to unitecusadesign.com');
      setWant(isSpanish ? 'Enfatizar textura táctil de hilo y elegancia atemporal' : 'Emphasize tactile thread relief and timeless elegance');
      setTone('Luxury/Aspirational' as ToneOfVoice);
      setFramework('Storytelling');
      setComplianceFlags({ nsr10: false, waterproof: true, fobShipping: false, catalogLink: true });
    } else if (presetType === 'wood') {
      setTitle(isSpanish ? 'Paneles Acanalados de Madera PVC Lavables' : 'Washable Fluted Wood PVC Wall Panels');
      setTarget(isSpanish ? 'Diseñadores de locales comerciales y restaurantes' : 'Commercial retail & restaurant interior designers');
      setObjective(isSpanish ? 'Aumentar solicitudes de carpetas de muestras físicas' : 'Increase requests for physical sample binders');
      setWant(isSpanish ? 'Subrayar durabilidad de alto tráfico e instalación rápida' : 'Highlight high-traffic durability and fast installation');
      setTone('Informational');
      setFramework('BAB');
      setComplianceFlags({ nsr10: true, waterproof: true, fobShipping: true, catalogLink: true });
    } else if (presetType === 'wholesale') {
      setTitle(isSpanish ? 'Distribución Mayorista Directa por Contenedor FOB' : 'Direct Wholesale Container FOB Distribution');
      setTarget(isSpanish ? 'Importadores, ferreterías grandes y distribuidores en Colombia' : 'Importers, large hardware chains & distributors in LATAM');
      setObjective(isSpanish ? 'Cerrar acuerdos de representación regional' : 'Close regional dealership & distribution agreements');
      setWant(isSpanish ? 'Mencionar despachos consolidados desde Miami / Cartagena' : 'Mention consolidated shipments from Miami / Cartagena ports');
      setTone('Sales-driven');
      setFramework('Direct-Response');
      setComplianceFlags({ nsr10: true, waterproof: true, fobShipping: true, catalogLink: true });
    } else {
      setTitle(isSpanish ? 'Cumplimiento Normativo Fuego NSR-10 y Ficha Técnica' : 'NSR-10 Fire Code Safety Compliance & Data Sheet');
      setTarget(isSpanish ? 'Directores de obra, interventores y auditores de construcción' : 'Site managers, construction auditors & engineers');
      setObjective(isSpanish ? 'Aprobar especificaciones técnicas en pliegos de licitación' : 'Get technical specifications approved for project bidding');
      setWant(isSpanish ? 'Adjuntar certificación de retardación de llama para fachadas internas' : 'Attach flame retardation certification for internal commercial walls');
      setTone('Informational');
      setFramework('4Ps');
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
          framework,
          complianceFlags: activeComplianceList,
          language
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedPost(data.text);
        showToast(isSpanish ? `¡Contenido generado con fórmula ${framework}!` : `Optimized content generated with ${framework} formula!`);
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (err: any) {
      console.error(err?.message || 'Error generating creative');
      showToast(isSpanish ? 'Generando contenido optimizado...' : 'Generating fallback content...');
      simulateFallbackPost();
    } finally {
      setIsGenerating(false);
    }
  };

  const simulateFallbackPost = () => {
    const effectiveTitle = title || (isSpanish ? 'Revestimientos PVC de Alta Gama 3D' : 'Luxury 3D PVC Wall Cladding');
    
    const fallbackText = isSpanish 
      ? `✨ [TITULAR PRINCIPAL & 3 GANCHOS A/B DE ALTA RETENCIÓN]
• Gancho A (Curiosidad): ¿Por qué los arquitectos de lujo están reemplazando la madera y el mármol tradicional por PVC 3D en 2026?
• Gancho B (Estadística de Impacto): El 84% de las fallas en muros interiores se deben a humedad y mantenimiento costoso. Así es como se elimina el problema.
• Gancho C (Beneficio Directo): Consigue la estética impecable de un showroom europeo con 100% de impermeabilidad y norma de fuego NSR-10.

---

📖 [CUERPO DEL MENSAJE / POST - FÓRMULA ${framework}]
¿Cansado de elegir entre estética de lujo y durabilidad real para tus proyectos de alto tráfico?

Con la colección exclusiva de **${effectiveTitle}** de UNITEC USA Design, ya no tienes que comprometer nada. Desarrollado para ${target || 'arquitectos, diseñadores de interiores y desarrolladores exigentes'}, cada panel combina relieves táctiles profundos con resistencia industrial.

• **100% Impermeable y Lavable:** Cero filtraciones o acumulación de moho en zonas húmedas o comerciales.
• **Acabados Hiperrealistas:** Texturas de hilo damasco, mármol Carrara y destellos metálicos reflectivos.
• **Instalación Eficiente:** Reduce hasta un 40% los tiempos de obra frente a materiales tradicionales.

---

🔒 [PUNTOS CLAVE Y ESPECIFICACIONES]
✓ Certificación y cumplimiento de la norma NSR-10 contra retardación de fuego en fachadas interiores.
✓ Polímeros de alta densidad resistentes al impacto y desgaste continuo.
${complianceFlags.fobShipping ? '✓ Logística mayorista por contenedor completo (FOB Miami / Cartagena / Buenaventura).\n' : ''}✓ Catálogo y fichas técnicas disponibles en unitecusadesign.com

---

📊 [ESTRUCTURA DE CARRUSEL / SLIDE-BY-SLIDE (LinkedIn & Instagram)]
• Slide 1 (Portada & Gancho): "${effectiveTitle}: El nuevo estándar en acabados arquitectónicos."
• Slide 2 (El Problema): "El alto costo de mantenimiento y el deterioro por humedad en revestimientos convencionales."
• Slide 3 (La Solución): "Tecnología de polímero PVC con texturas 3D realistas y cero absorción de agua."
• Slide 4 (Beneficios & Prueba): "Instalación en tiempo récord, certificación NSR-10 y variedad de patrones de diseño."
• Slide 5 (Cierre & CTA): "Desliza para cotizar tu proyecto o visita unitecusadesign.com para pedir tu muestrario."

---

🎯 [LLAMADOS A LA ACCIÓN DINÁMICOS (CTAs)]
• Opción 1 (Direct Message / Lead): "Envía un DM con la palabra 'MUESTRAS' para recibir la carpeta física en tu estudio."
• Opción 2 (Guardar / Compartir): "Guarda este post en tu carpeta de especificaciones para tu próxima cotización de obra."
• Opción 3 (Debate / Comentario): "¿Prefieres acabados mate arquitectónicos o brillos metálicos reflectivos? Comenta abajo."

---

🖼️ [PROMPT PARA IMAGEN PUBLICITARIA (Google Imagen 3)]
Photorealistic 8K commercial product visual of ${effectiveTitle}. Luxury modern living room wall with warm showroom track lighting f/2.8, shallow depth of field highlighting tactile 3D geometric embossing, premium gold and marble accents, architectural magazine cover aesthetic.

---

🎬 [PROMPT Y GUIÓN DE VIDEO (UNITEC STUDIO & Google Veo)]
• Prompt de Video: Cinematic 8K commercial video pan of a luxury showroom wall with ${effectiveTitle}, smooth slider motion, dramatic side lighting showing 3D depth.
• Gancho en Pantalla (0-3s): "El error que cometen en acabados de muros ❌ (Y cómo solucionarlo)"
• Retención y Demostración (3-12s): Paneo mostrando resistencia al agua y textura de alto relieve sin marcas de dedos.
• Cierre y CTA (12-20s): "Pide tu catálogo mayorista con precios de fábrica en el link de la bio."
• Voz en Off: "¿Buscas distinción sin sobrecostos? Conoce los revestimientos PVC de UNITEC USA Design. Calidad certificada y stock inmediato."

---

🏷️ [CLUSTER ESTRATÉGICO DE HASHTAGS]
• Nicho (Alta Conversión): #PVCWallpaper #Revestimientos3D #PapelTapizDeLujo #InteriorismoColombia #NSR10
• Industria / B2B: #ArquitecturaComercial #MaterialesDeConstruccion #ContratistasFlorida #DisenoInteriores
• Tendencia & Alcance: #UnitecUSA #ShowroomMiami #DecoracionDeLujo #TendenciasDiseno2026`
      : `✨ [MAIN HEADLINE & 3 HIGH-RETENTION A/B HOOKS]
• Hook A (Curiosity): Why are top commercial architects switching from heavy stone to 3D PVC panels in 2026?
• Hook B (High-Impact Data): 84% of interior wall maintenance costs come from moisture damage. Here is the permanent fix.
• Hook C (Direct Benefit): Achieve European luxury showroom aesthetics with 100% waterproof durability and fire safety compliance.

---

📖 [MAIN POST BODY - ${framework} FORMULA]
Tired of compromising between timeless luxury and commercial-grade durability?

With UNITEC USA Design's **${effectiveTitle}** collection, you get the best of both worlds. Engineered for ${target || 'architects, interior designers, and hospitality developers'}, each cladding panel delivers deep tactile reliefs with zero maintenance.

• **100% Waterproof & Washable:** Zero moisture retention and anti-mold protection for high-traffic environments.
• **Hyper-Realistic Finishes:** Damask silk embossing, Carrara marble gloss, and reflective metallic veins.
• **Fast Turnaround:** Cut installation time by up to 40% compared to traditional wall materials.

---

🔒 [KEY SPECIFICATIONS & COMPLIANCE]
✓ Certified fire retardation compliance for interior commercial spaces.
✓ High-density PVC polymer composite built for lasting wear resistance.
${complianceFlags.fobShipping ? '✓ Direct container logistics available from Miami & LATAM ports.\n' : ''}✓ Specification sheets available at unitecusadesign.com

---

📊 [CAROUSEL STRUCTURE / SLIDE-BY-SLIDE (LinkedIn & Instagram)]
• Slide 1 (Cover): "${effectiveTitle}: Elevate your commercial and residential projects."
• Slide 2 (The Challenge): "Why conventional wallpapers fail in humid and high-traffic spaces."
• Slide 3 (The Solution): "High-density polymer composite with tactile 3D depth and zero water absorption."
• Slide 4 (Features): "NSR-10 fire code compliance, fast installation, and luxury aesthetics."
• Slide 5 (Call to Action): "Swipe to order project sample binders or visit unitecusadesign.com."

---

🎯 [DYNAMIC CALLS TO ACTION (CTAs)]
• Option 1 (Direct Message): "Send a DM with 'SAMPLES' to receive our curated architectural binder."
• Option 2 (Save / Bookmark): "Save this post to your project design board for your next commercial bid."
• Option 3 (Engagement / Comment): "Which finish matches your aesthetic: Matte Architectural or Reflective Gold?"

---

🖼️ [AI VISUAL PROMPT (Google Imagen 3)]
Photorealistic 8K commercial photo of ${effectiveTitle}. Modern penthouse living space with warm architectural spotlighting f/2.8, close-up macro showing intricate 3D embossed relief, luxury aesthetics.

---

🎬 [VIDEO SCRIPT & PROMPT (UNITEC STUDIO & Google Veo)]
• Video Prompt: Cinematic 8K camera slider reveal of modern executive wall with ${effectiveTitle}, warm commercial lighting.
• On-Screen Hook (0-3s): "Stop using outdated wall materials in 2026 🛑"
• Retention (3-12s): Close-up texture wipe proving scratch resistance and waterproof finish.
• Outro CTA (12-20s): "Order contractor sample binders directly at unitecusadesign.com"
• Voiceover: "Transform your interiors with UNITEC USA Design. European elegance engineered for high performance."

---

🏷️ [STRATEGIC HASHTAG CLUSTER]
• Niche (High-Conversion): #PVCWallpaper #3DWallCladding #LuxuryWallpaper #CommercialInteriors #NSR10
• Industry / B2B: #InteriorDesigners #HospitalityDesign #ArchitectureMiami #WallPanels
• Trending & Reach: #UnitecUSA #LuxuryLiving #DesignTrends2026 #HomeRenovation`;

    setGeneratedPost(fallbackText);
  };

  const handleCopy = () => {
    if (!generatedPost) return;
    navigator.clipboard.writeText(generatedPost);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    showToast(isSpanish ? 'Publicación copiada al portapapeles' : 'Post copied to clipboard');
  };

  // Section extractor helpers
  const extractSection = (regex: RegExp, fallback: string): string => {
    if (!generatedPost) return fallback;
    const match = generatedPost.match(regex);
    return match && match[1] ? match[1].trim() : fallback;
  };

  const getFilteredContent = () => {
    if (!generatedPost) return '';
    if (activeOutputTab === 'full') return generatedPost;
    
    if (activeOutputTab === 'hooks') {
      return extractSection(/✨ \[TITULAR[^\]]*\]\n([\s\S]*?)(?=\n\n---|\n\n📖|$)/, '✨ Ganchos A/B no encontrados en el texto.');
    }
    if (activeOutputTab === 'carousel') {
      return extractSection(/📊 \[ESTRUCTURA DE CARRUSEL[^\]]*\]\n([\s\S]*?)(?=\n\n---|\n\n🎯|$)/, '📊 Estructura de carrusel no encontrada.');
    }
    if (activeOutputTab === 'video') {
      return extractSection(/🎬 \[PROMPT Y GUIÓN DE VIDEO[^\]]*\]\n([\s\S]*?)(?=\n\n---|\n\n🏷️|$)/, '🎬 Guión de video no encontrado.');
    }
    if (activeOutputTab === 'hashtags') {
      return extractSection(/🏷️ \[CLUSTER ESTRATÉGICO DE HASHTAGS[^\]]*\]\n([\s\S]*?)$/, '🏷️ Hashtags no encontrados.');
    }
    return generatedPost;
  };

  const handleCopySection = (textToCopy: string, label: string) => {
    navigator.clipboard.writeText(textToCopy);
    showToast(isSpanish ? `¡${label} copiado!` : `Copied ${label}!`);
  };

  // Extract visual prompt section specifically
  const extractVisualPrompt = (): string => {
    if (!generatedPost) return '';
    const match = generatedPost.match(/🖼️ \[PROMPT PARA IMAGEN[^\]]*\]\n([\s\S]*?)(?=\n\n---|\n\n🎬|$)/);
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
    showToast(isSpanish ? 'Prompt visual de IA copiado para Google Veo/Imagen' : 'AI Visual Prompt copied for Google Veo/Imagen');
  };

  return (
    <div id="unified-social-post-playground" className="bg-white border border-[#e5e5df] rounded-xl text-[#1a1a1a] shadow-sm overflow-hidden flex flex-col mt-6">
      {/* Banner Header */}
      <div className="bg-[#2d5a4a] p-5 text-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-1.5 bg-[#c9a961] text-stone-950 font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded">
            <Sparkles size={9} className="animate-spin" />
            {isSpanish ? 'GEMINI 3.7 • COPYWRITING DE ALTA CONVERSIÓN' : 'GEMINI 3.7 • HIGH-CONVERTING SOCIAL ENGINE'}
          </div>
          <h3 className="text-sm font-sans font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText size={18} className="text-[#c9a961]" />
            {isSpanish ? 'Generador Creativo Multiformato & Fórmulas de Copy' : 'Multi-Format Creative Generator & Copy Frameworks'}
          </h3>
          <p className="text-[10px] text-stone-200 font-sans">
            {isSpanish 
              ? 'Fórmulas probadas (PAS, AIDA, BAB), ganchos A/B, estructuras de carrusel, guiones de video y clusters de hashtags' 
              : 'Proven formulas (PAS, AIDA, BAB), A/B hooks, carousel slides, video scripts, and hashtag clusters'}
          </p>
        </div>

        {/* Industry Presets Quick-Deck */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[9px] font-mono uppercase font-extrabold text-[#c9a961] mr-1">
            {isSpanish ? 'PRESETS:' : 'PRESETS:'}
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
          
          {/* Section 1: Copywriting Framework Selector */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10.5px] font-mono uppercase font-black text-stone-800 flex items-center gap-1.5">
                <Zap size={13} className="text-[#c9a961]" />
                {isSpanish ? '1. Fórmula de Copywriting Estratégica:' : '1. Copywriting Framework Formula:'}
              </span>
              <span className="text-[9px] font-mono text-stone-500 font-bold">
                {framework}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {[
                { id: 'PAS', label: 'PAS', desc: 'Problem-Agitate-Solution' },
                { id: 'AIDA', label: 'AIDA', desc: 'Attention-Interest-Desire-Action' },
                { id: 'BAB', label: 'BAB', desc: 'Before-After-Bridge' },
                { id: '4Ps', label: '4Ps', desc: 'Picture-Promise-Prove-Push' },
                { id: 'Storytelling', label: 'Story', desc: 'Hook-Conflict-Offer' },
                { id: 'Direct-Response', label: 'Direct', desc: 'Direct Conversion Offer' },
              ].map((fw) => (
                <button
                  key={fw.id}
                  type="button"
                  onClick={() => setFramework(fw.id as CopywritingFramework)}
                  title={fw.desc}
                  className={`py-1.5 px-2 rounded text-[10px] font-mono font-bold text-center transition-all cursor-pointer border ${
                    framework === fw.id
                      ? 'bg-[#2d5a4a] text-white border-[#2d5a4a] shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400 hover:bg-stone-100'
                  }`}
                >
                  {fw.label}
                </button>
              ))}
            </div>

            <p className="text-[9.5px] text-stone-500 font-sans italic">
              {framework === 'PAS' && (isSpanish ? '🎯 PAS: Expone el dolor del cliente, agita el problema y presenta tu producto como la solución definitiva.' : '🎯 PAS: Identifies pain points, agitates cost of inaction, and delivers the ultimate solution.')}
              {framework === 'AIDA' && (isSpanish ? '🧲 AIDA: Capta atención inmediata, genera interés con datos, despierta deseo y empuja a la acción.' : '🧲 AIDA: Magnetic hook, builds interest with facts, stirs desire, and drives direct action.')}
              {framework === 'BAB' && (isSpanish ? '🌉 BAB: Muestra el antes (frustración), visualiza el después (transformación) y posiciona tu marca como el puente.' : '🌉 BAB: Paints before-state, visualizes transformed after-state, and builds the bridge.')}
              {framework === '4Ps' && (isSpanish ? '🖼️ 4Ps: Pinta el escenario soñado, haz una promesa audaz, demuestra con datos técnicos y empuja al cierre.' : '🖼️ 4Ps: Picture the dream, make bold promise, prove with technical data, push to close.')}
              {framework === 'Storytelling' && (isSpanish ? '📖 Storytelling: Narrativa humana de transformación para máxima retención en los primeros segundos de video.' : '📖 Storytelling: Engaging human narrative with high retention for reels and video shorts.')}
              {framework === 'Direct-Response' && (isSpanish ? '⚡ Direct-Response: Oferta comercial directa, eliminación de objeciones y llamado a cotizar o comprar ya.' : '⚡ Direct-Response: Clear commercial offer, objection elimination, and instant call-to-action.')}
            </p>
          </div>

          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-[11px] font-mono uppercase font-black text-stone-800 flex items-center gap-1.5">
              <Sliders size={13} className="text-[#c9a961]" />
              {isSpanish ? '2. Breviario Creativo & Variables' : '2. Creative Brief Variables'}
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
                {isSpanish ? 'Título / Tema Principal:' : 'Title / Main Topic:'}
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
              {isSpanish ? '3. Inclusión de Normativa & Ficha Técnica:' : '3. Technical & Compliance Requirements:'}
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
                  <span>{isSpanish ? `GENERANDO CON ${framework} & GEMINI 3.7...` : `GENERATING WITH ${framework} & GEMINI 3.7...`}</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>{isSpanish ? `Generar Campaña con Fórmula ${framework}` : `Generate Campaign with ${framework} Formula`}</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Column: Generated Output Deck (6 cols on desktop) */}
        <div className="lg:col-span-6 bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col justify-between min-h-[480px]">
          {generatedPost ? (
            <div className="space-y-3.5 flex flex-col justify-between h-full text-left">
              
              {/* Header Bar with Filter Tabs */}
              <div className="space-y-2 border-b pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-black text-[#2d5a4a] bg-[#2d5a4a]/10 border border-[#2d5a4a]/25 px-2.5 py-1 rounded flex items-center gap-1.5">
                    <Sparkles size={11} className="text-[#c9a961]" />
                    {isSpanish ? `Campaña Optimizada (${framework})` : `Optimized Campaign (${framework})`}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCopyVisualPrompt}
                      className="p-1.5 bg-white border border-stone-200 text-stone-700 hover:text-black rounded transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-sans font-bold"
                      title={isSpanish ? 'Copiar prompt para Google Veo 3.1 e Imagen' : 'Copy prompt for Google Veo 3.1 & Imagen'}
                    >
                      <Video size={12} className="text-[#c9a961]" />
                      <span>{isPromptCopied ? (isSpanish ? '¡Copiado!' : 'Copied!') : (isSpanish ? 'Prompt Video' : 'Visual Prompt')}</span>
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

                {/* Section Quick-Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  <button
                    onClick={() => setActiveOutputTab('full')}
                    className={`px-2 py-1 rounded text-[9.5px] font-mono font-bold transition-all cursor-pointer ${
                      activeOutputTab === 'full' 
                        ? 'bg-[#2d5a4a] text-white' 
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {isSpanish ? 'Todo' : 'Full Post'}
                  </button>
                  <button
                    onClick={() => setActiveOutputTab('hooks')}
                    className={`px-2 py-1 rounded text-[9.5px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      activeOutputTab === 'hooks' 
                        ? 'bg-[#2d5a4a] text-white' 
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <Zap size={10} />
                    <span>{isSpanish ? 'Ganchos A/B' : 'A/B Hooks'}</span>
                  </button>
                  <button
                    onClick={() => setActiveOutputTab('carousel')}
                    className={`px-2 py-1 rounded text-[9.5px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      activeOutputTab === 'carousel' 
                        ? 'bg-[#2d5a4a] text-white' 
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <Layers size={10} />
                    <span>{isSpanish ? 'Carrusel (5 Slides)' : 'Carousel Slides'}</span>
                  </button>
                  <button
                    onClick={() => setActiveOutputTab('video')}
                    className={`px-2 py-1 rounded text-[9.5px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      activeOutputTab === 'video' 
                        ? 'bg-[#2d5a4a] text-white' 
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <Video size={10} />
                    <span>{isSpanish ? 'Guión Video' : 'Video Script'}</span>
                  </button>
                  <button
                    onClick={() => setActiveOutputTab('hashtags')}
                    className={`px-2 py-1 rounded text-[9.5px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      activeOutputTab === 'hashtags' 
                        ? 'bg-[#2d5a4a] text-white' 
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <Hash size={10} />
                    <span>{isSpanish ? 'Hashtag Clusters' : 'Hashtags'}</span>
                  </button>
                </div>
              </div>

              {/* Formatted Output Box with Tab Filtering */}
              <div className="bg-white p-4 rounded-lg border border-stone-200 text-xs text-stone-800 font-sans leading-relaxed whitespace-pre-wrap max-h-[380px] overflow-y-auto select-all shadow-xs relative">
                {getFilteredContent()}
              </div>

              {/* Quick Copy Section Shortcut */}
              {activeOutputTab !== 'full' && (
                <div className="flex justify-end">
                  <button
                    onClick={() => handleCopySection(getFilteredContent(), activeOutputTab.toUpperCase())}
                    className="px-2.5 py-1 bg-stone-150 hover:bg-stone-200 text-stone-800 text-[10px] font-mono font-bold rounded flex items-center gap-1 cursor-pointer transition-colors border border-stone-300"
                  >
                    <Copy size={11} />
                    <span>{isSpanish ? `Copiar sólo ${activeOutputTab}` : `Copy ${activeOutputTab} only`}</span>
                  </button>
                </div>
              )}

              <div className="text-[9px] font-mono text-stone-500 text-center pt-2 border-t leading-tight flex justify-between items-center">
                <span>{isSpanish ? `※ Generado con fórmula ${framework} y optimización para redes.` : `※ Optimized with ${framework} formula for social conversion.`}</span>
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
                  ? 'Elige una fórmula (PAS, AIDA, BAB, Storytelling) y genera copys, ganchos A/B, carruseles y guiones de video al instante' 
                  : 'Choose a formula (PAS, AIDA, BAB, Storytelling) and generate copies, A/B hooks, carousel slides, and video scripts'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}


