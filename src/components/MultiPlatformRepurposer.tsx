/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Share2,
  Sparkles,
  Copy,
  Check,
  Globe,
  Instagram,
  Linkedin,
  Video,
  Mail,
  Target,
  ExternalLink,
  Layers,
  ArrowRight,
  TrendingUp,
  MessageCircle,
  FileCheck
} from 'lucide-react';

export interface MultiPlatformVariants {
  instagram: {
    hook: string;
    caption: string;
    hashtags: string;
    visualDirection: string;
  };
  linkedin: {
    headline: string;
    articlePost: string;
    takeaways: string[];
    callToAction: string;
  };
  tiktokReels: {
    hook0to3s: string;
    sceneScript: string;
    onScreenText: string;
    audioTrendSuggestion: string;
  };
  emailNewsletter: {
    subjectLines: string[];
    previewSnippet: string;
    emailBody: string;
    buttonCta: string;
  };
  metaAds: {
    primaryTextVariations: string[];
    headlineVariations: string[];
    leadFormCta: string;
  };
  crmLeadMagnet: {
    suggestedLeadMagnet: string;
    whatsappDirectUrl: string;
    hubspotUtmLink: string;
  };
}

interface MultiPlatformRepurposerProps {
  campaignTitle: string;
  contextText: string;
  generatedPost: string;
  selectedTone: string;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export default function MultiPlatformRepurposer({
  campaignTitle,
  contextText,
  generatedPost,
  selectedTone,
  showToast
}: MultiPlatformRepurposerProps) {
  const [selectedChannel, setSelectedChannel] = useState<'instagram' | 'linkedin' | 'tiktokReels' | 'emailNewsletter' | 'metaAds' | 'crm'>('instagram');
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [channelData, setChannelData] = useState<MultiPlatformVariants | null>(() => {
    try {
      const saved = localStorage.getItem('unitec_multiplatform_variants');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not parse stored variants', e);
    }
    return null;
  });

  const [whatsappPhone, setWhatsappPhone] = useState('13055550199');
  const [customUtmCampaign, setCustomUtmCampaign] = useState(() => {
    return (campaignTitle || 'campana_unitec').toLowerCase().replace(/[^a-z0-9]/g, '_');
  });

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    showToast('¡Copiado al portapapeles con éxito!', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const generateVariantsWithGemini = async () => {
    setIsGeneratingAll(true);
    try {
      const response = await fetch('/api/gemini/generate-multiplatform-bundle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignTitle: campaignTitle || 'Lanzamiento Exclusivo UNITEC',
          contextText: contextText || '',
          basePost: generatedPost || '',
          tone: selectedTone,
          whatsappNumber: whatsappPhone,
          utmCampaign: customUtmCampaign
        })
      });

      const data = await response.json();
      if (data.success && data.variants) {
        setChannelData(data.variants);
        localStorage.setItem('unitec_multiplatform_variants', JSON.stringify(data.variants));
        showToast('¡Estrategia multicanal y CRM generada con Google Gemini!', 'success');
      } else {
        showToast(data.error || 'Error al generar variantes multicanal', 'error');
      }
    } catch (err: any) {
      console.error('Multiplatform generation error:', err);
      showToast('Error de conexión con el motor de Gemini', 'error');
    } finally {
      setIsGeneratingAll(false);
    }
  };

  const buildWhatsappLink = () => {
    const message = encodeURIComponent(`Hola UNITEC, me interesa recibir más información sobre la campaña "${campaignTitle || 'Lanzamiento'}"`);
    return `https://wa.me/${whatsappPhone.replace(/[^0-9]/g, '')}?text=${message}`;
  };

  const buildHubspotLink = (source: string) => {
    return `https://unitecdesign.com/catalogo?utm_source=${source}&utm_medium=social_ai&utm_campaign=${customUtmCampaign}&utm_content=gemini_engine`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-6 transition-colors">
      {/* Header with trigger button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <Share2 size={20} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Automatización Multicanal & CRM Hub
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-extrabold uppercase tracking-wide">
                Gemini 3.7
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transforma tu briefing en formatos optimizados para Instagram, LinkedIn, TikTok/Reels, Email y Lead Capture con UTMs.
            </p>
          </div>
        </div>

        <button
          onClick={generateVariantsWithGemini}
          disabled={isGeneratingAll}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Sparkles size={15} className={isGeneratingAll ? 'animate-spin' : ''} />
          <span>{isGeneratingAll ? 'Gemini adaptando a 5 canales...' : 'Adaptar a Todos los Canales (1-Click)'}</span>
        </button>
      </div>

      {/* Channel selector tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'instagram', label: 'Instagram / FB', icon: Instagram, color: 'text-pink-500' },
          { id: 'linkedin', label: 'LinkedIn B2B', icon: Linkedin, color: 'text-blue-500' },
          { id: 'tiktokReels', label: 'TikTok & Reels (Guión)', icon: Video, color: 'text-purple-500' },
          { id: 'emailNewsletter', label: 'Email Newsletter', icon: Mail, color: 'text-amber-500' },
          { id: 'metaAds', label: 'Meta & Google Ads', icon: Target, color: 'text-emerald-500' },
          { id: 'crm', label: 'CRM & Lead Links', icon: Globe, color: 'text-cyan-500' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedChannel === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedChannel(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/80 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <Icon size={15} className={tab.color} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Channel Content View */}
      <div className="space-y-4">
        {selectedChannel === 'instagram' && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Instagram size={16} className="text-pink-500" />
                Formato Carrusel y Feed (Instagram / Facebook)
              </span>
              <button
                onClick={() => handleCopy(channelData?.instagram?.caption || '', 'ig-caption')}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {copiedKey === 'ig-caption' ? <Check size={14} /> : <Copy size={14} />}
                Copiar Caption
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Hook de Primeras 2 Líneas (Above the Fold):</label>
              <p className="p-3 bg-white dark:bg-slate-850 rounded-lg text-xs font-semibold text-slate-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700">
                {channelData?.instagram?.hook || `🔥 ${campaignTitle || 'Descubre la nueva era'}: Elegancia y diseño arquitectónico sin límites.`}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Cuerpo de Caption con Emojis & Formato Visual:</label>
              <div className="p-3.5 bg-white dark:bg-slate-850 rounded-lg text-xs leading-relaxed text-slate-800 dark:text-slate-200 border border-gray-200 dark:border-slate-700 whitespace-pre-line font-sans">
                {channelData?.instagram?.caption || `¿Buscando acabados que eleven tus proyectos al siguiente nivel? ✨\n\nNuestra nueva colección para ${campaignTitle || 'UNITEC'} combina tecnología de vanguardia y estética premium.\n\n✔️ 100% Resistente y duradero\n✔️ Texturas tridimensionales y acabados de lujo\n✔️ Entrega inmediata en Miami y envíos a toda la región\n\n💬 Escríbenos por DM o haz clic en el enlace de la bio para recibir el catálogo exclusivo.`}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Hashtags Estratégicos:</label>
              <p className="p-2.5 bg-blue-50/50 dark:bg-blue-950/30 rounded-lg text-xs text-blue-700 dark:text-blue-300 font-mono border border-blue-100 dark:border-blue-900/50">
                {channelData?.instagram?.hashtags || '#UnitecDesign #ArquitecturaDeLujo #InteriorismoMiami #MaterialesDeVanguardia #LuxuryLiving'}
              </p>
            </div>
          </div>
        )}

        {selectedChannel === 'linkedin' && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Linkedin size={16} className="text-blue-600" />
                Post B2B & Thought Leadership (LinkedIn)
              </span>
              <button
                onClick={() => handleCopy(channelData?.linkedin?.articlePost || '', 'linkedin-post')}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {copiedKey === 'linkedin-post' ? <Check size={14} /> : <Copy size={14} />}
                Copiar Post B2B
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Titular Profesional B2B:</label>
              <p className="p-3 bg-white dark:bg-slate-850 rounded-lg text-xs font-bold text-slate-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700">
                {channelData?.linkedin?.headline || `Cómo la innovación en materiales arquitectónicos está redefiniendo el ROI en desarrollos comerciales.`}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Artículo / Publicación Ejecutiva:</label>
              <div className="p-3.5 bg-white dark:bg-slate-850 rounded-lg text-xs leading-relaxed text-slate-800 dark:text-slate-200 border border-gray-200 dark:border-slate-700 whitespace-pre-line">
                {channelData?.linkedin?.articlePost || `En la industria del diseño y la construcción, la diferenciación competitiva ya no es opcional; es el pilar de la rentabilidad.\n\nCon la iniciativa "${campaignTitle || 'Estratégica'}", exploramos cómo la integración de acabados arquitectónicos de alta especificación optimiza tanto los tiempos de obra como la percepción de valor final del cliente.\n\nTres aprendizajes clave para contratistas y arquitectos:\n1. Durabilidad comprobada con bajo mantenimiento a largo plazo.\n2. Sostenibilidad y certificaciones que facilitan la aprobación técnica.\n3. Acabados estéticos de impacto directo en la valorización del metro cuadrado.`}
              </div>
            </div>
          </div>
        )}

        {selectedChannel === 'tiktokReels' && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Video size={16} className="text-purple-500" />
                Guión Viral de 15s (TikTok / Instagram Reels / Shorts)
              </span>
              <button
                onClick={() => handleCopy(channelData?.tiktokReels?.sceneScript || '', 'tiktok-script')}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {copiedKey === 'tiktok-script' ? <Check size={14} /> : <Copy size={14} />}
                Copiar Guión
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-white dark:bg-slate-850 rounded-lg border border-gray-200 dark:border-slate-700">
                <span className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400">Visual Hook (0-3 segundos):</span>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                  {channelData?.tiktokReels?.hook0to3s || `"Si estás diseñando o remodelando en 2026, cometerás un error si no usas esto..."`}
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-850 rounded-lg border border-gray-200 dark:border-slate-700">
                <span className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400">Texto en Pantalla (Overlay):</span>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                  {channelData?.tiktokReels?.onScreenText || `👀 EL SECRETO DE LOS ARQUITECTOS EN MIAMI 🤫`}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Guión de Audio y Dirección de Escena:</label>
              <div className="p-3.5 bg-white dark:bg-slate-850 rounded-lg text-xs leading-relaxed text-slate-800 dark:text-slate-200 border border-gray-200 dark:border-slate-700 whitespace-pre-line font-mono text-[11px]">
                {channelData?.tiktokReels?.sceneScript || `[Corte 1 - 0:00 a 0:03] Cámara en mano tocando la textura del material.\nVoz: "¿Sabías que este acabado resiste agua, golpes y se instala en la mitad del tiempo?"\n\n[Corte 2 - 0:03 a 0:10] Paneo rápido por el showroom iluminado.\nVoz: "Es la nueva colección de UNITEC USA Design. Mira los reflejos y el nivel de detalle..."\n\n[Corte 3 - 0:10 a 0:15] Pantalla con CTA y enlace en biografía.\nVoz: "Comenta 'CATÁLOGO' y te enviamos el PDF con precios para contratistas hoy mismo."`}
              </div>
            </div>
          </div>
        )}

        {selectedChannel === 'emailNewsletter' && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Mail size={16} className="text-amber-500" />
                Campaña de Email Marketing & Newsletter
              </span>
              <button
                onClick={() => handleCopy(channelData?.emailNewsletter?.emailBody || '', 'email-body')}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {copiedKey === 'email-body' ? <Check size={14} /> : <Copy size={14} />}
                Copiar Email Completo
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">3 Asuntos con Alta Tasa de Apertura (A/B Test):</label>
              <div className="space-y-1.5">
                {(channelData?.emailNewsletter?.subjectLines || [
                  `⚡ [Exclusivo] Nueva colección ${campaignTitle || 'UNITEC'}: Acceso anticipado`,
                  `¿Tus proyectos necesitan este acabado? Mira la diferencia ✨`,
                  `Ficha técnica y catálogo exclusivo para tu próximo diseño`
                ]).map((subject, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-850 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200">
                    <span>{subject}</span>
                    <button
                      onClick={() => handleCopy(subject, `sub-${idx}`)}
                      className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer"
                      title="Copiar asunto"
                    >
                      {copiedKey === `sub-${idx}` ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Cuerpo del Email:</label>
              <div className="p-3.5 bg-white dark:bg-slate-850 rounded-lg text-xs leading-relaxed text-slate-800 dark:text-slate-200 border border-gray-200 dark:border-slate-700 whitespace-pre-line">
                {channelData?.emailNewsletter?.emailBody || `Hola [Nombre],\n\nNos complace presentarte nuestro más reciente lanzamiento enfocado en arquitectos y diseñadores que buscan la máxima excelencia estética y funcional: **${campaignTitle || 'Soluciones UNITEC'}**.\n\nDiseñado para resistir las exigencias del clima y el uso diario sin perder un milímetro de sofisticación.\n\n¿Deseas programar una muestra física en tu estudio o recibir el catálogo con precios mayoristas?\n\nHaz clic en el botón a continuación para hablar directamente con nuestro asesor técnico.`}
              </div>
            </div>
          </div>
        )}

        {selectedChannel === 'metaAds' && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Target size={16} className="text-emerald-500" />
                Creativos para Meta Ads & Google Ads
              </span>
              <button
                onClick={() => handleCopy((channelData?.metaAds?.primaryTextVariations || []).join('\n---\n'), 'ads-bundle')}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {copiedKey === 'ads-bundle' ? <Check size={14} /> : <Copy size={14} />}
                Copiar Todas las Variaciones
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Titulares de Alto CTR (Headlines):</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(channelData?.metaAds?.headlineVariations || [
                  'Acabados de Lujo en Miami • Stock Inmediato',
                  'Eleva el Valor de tus Proyectos Hoy',
                  'Catálogo Exclusivo para Contratistas'
                ]).map((head, idx) => (
                  <div key={idx} className="p-2.5 bg-white dark:bg-slate-850 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{head}</span>
                    <button onClick={() => handleCopy(head, `head-${idx}`)} className="text-slate-400 hover:text-blue-600 p-1">
                      {copiedKey === `head-${idx}` ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Texto Principal (Primary Text Variation):</label>
              <div className="p-3.5 bg-white dark:bg-slate-850 rounded-lg text-xs leading-relaxed text-slate-800 dark:text-slate-200 border border-gray-200 dark:border-slate-700 whitespace-pre-line">
                {(channelData?.metaAds?.primaryTextVariations && channelData.metaAds.primaryTextVariations[0]) ||
                  `¿Buscas proveedores de confianza para acabados arquitectónicos en Florida? En UNITEC USA Design ofrecemos materiales de vanguardia con entrega rápida y asesoría experta. Solicita tu muestra hoy.`}
              </div>
            </div>
          </div>
        )}

        {selectedChannel === 'crm' && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Globe size={16} className="text-cyan-500" />
                Generador de Enlaces de Captura & WhatsApp CRM con UTMs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Número de WhatsApp Comercial:</label>
                <input
                  type="text"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="Ej: 13055550199"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-850 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Campaña UTM (Tag para Analytics / HubSpot):</label>
                <input
                  type="text"
                  value={customUtmCampaign}
                  onChange={(e) => setCustomUtmCampaign(e.target.value)}
                  placeholder="lanzamiento_wpc_2026"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-850 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Generated Links Display */}
            <div className="space-y-3 pt-2">
              <div className="p-3 bg-white dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <MessageCircle size={14} /> Enlace Directo a WhatsApp con Mensaje Pre-llenado
                  </span>
                  <button
                    onClick={() => handleCopy(buildWhatsappLink(), 'wa-link')}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    {copiedKey === 'wa-link' ? <Check size={13} /> : <Copy size={13} />} Copiar Enlace
                  </button>
                </div>
                <p className="text-[11px] font-mono text-slate-600 dark:text-slate-300 break-all bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                  {buildWhatsappLink()}
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <TrendingUp size={14} /> Enlace Web / Landing Page con UTM Tracking
                  </span>
                  <button
                    onClick={() => handleCopy(buildHubspotLink('instagram'), 'utm-link')}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    {copiedKey === 'utm-link' ? <Check size={13} /> : <Copy size={13} />} Copiar Enlace
                  </button>
                </div>
                <p className="text-[11px] font-mono text-slate-600 dark:text-slate-300 break-all bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                  {buildHubspotLink('instagram')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
