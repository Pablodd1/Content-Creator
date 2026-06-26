/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Copy,
  Check,
  AlertTriangle,
  FileText,
  Printer,
  ChevronRight,
  ShieldCheck,
  Flag,
  Globe2,
  CheckSquare,
  Square,
  ClipboardList,
  Sparkles
} from 'lucide-react';
import { DayData, MonthData, PlatformPosts, ToneOfVoice } from '../types';
import { COLOMBIAN_HOLIDAYS_2026 } from '../data/mockData';

interface DailyContentPreviewProps {
  selectedDay: DayData | null;
  selectedMonth: MonthData;
  onGenerateDay: () => void;
  onUpdateDayStatus: (status: 'empty' | 'generated' | 'reviewed' | 'warning') => void;
  onPrintBrief: () => void;
  language: 'EN' | 'ES';
  onUpdateDate: (date: string) => void;
  onUpdateTime: (platform: 'instagram' | 'linkedin' | 'facebook' | 'youtube', time: string) => void;
  toneOfVoice: ToneOfVoice;
  onToneOfVoiceChange: (tone: ToneOfVoice) => void;
  integrateColombiaHolidays?: boolean;
  onUpdateDay?: (updatedDay: DayData) => void;
}

export default function DailyContentPreview({
  selectedDay,
  selectedMonth,
  onGenerateDay,
  onUpdateDayStatus,
  onPrintBrief,
  language,
  onUpdateDate,
  onUpdateTime,
  toneOfVoice,
  onToneOfVoiceChange,
  integrateColombiaHolidays = false,
  onUpdateDay
}: DailyContentPreviewProps) {
  const [activeTab, setActiveTab] = useState<'instagram' | 'linkedin' | 'facebook' | 'youtube'>('instagram');
  const [copiedState, setCopiedState] = useState<{ [key: string]: boolean }>({});

  const defaultTimes = {
    instagram: "09:00 AM",
    linkedin: "08:30 AM",
    facebook: "12:00 PM",
    youtube: "04:00 PM"
  };

  if (!selectedDay) {
    return (
      <div className="bg-white border border-[#e5e5df] rounded-xl p-8 text-center text-stone-400 flex flex-col items-center justify-center h-full min-h-[400px] shadow-sm animate-fadeIn">
        <Globe2 size={40} className="text-[#c9a961]/30 mb-3 animate-pulse" />
        <p className="font-sans font-bold text-stone-800 text-sm">
          {language === 'EN' ? 'No Day Selected' : 'Ningún Día Seleccionado'}
        </p>
        <p className="text-xs text-stone-500 mt-1 max-w-sm font-medium">
          {language === 'EN' 
            ? 'Select or click on any calendar block to load and edit its corresponding daily branding schedules.' 
            : 'Seleccione o haga clic en cualquier bloque del calendario para cargar y editar sus cronogramas de marca correspondientes.'}
        </p>
      </div>
    );
  }

  const hasContent = !!selectedDay.platforms;
  const posts = selectedDay.platforms as PlatformPosts;
  const warnings = selectedDay.accuracyWarnings || [];

  // Get initial checklist state dynamically or from DayData if it exists
  const getInitialChecklist = (): {
    hasAstmWarning: boolean;
    includesFobTerms: boolean;
    disclosesOrigin: boolean;
    bilingualDoubleReview: boolean;
    noUnverifiedClaims: boolean;
  } => {
    if (selectedDay.complianceChecks) {
      return selectedDay.complianceChecks;
    }

    const allWarnings = selectedDay.accuracyWarnings || [];
    const hasAstmWarningInList = allWarnings.some(w => /ASTM|waterproof/i.test(w));
    const hasFobWarningInList = allWarnings.some(w => /FOB/i.test(w));

    const allText = selectedDay.platforms 
      ? Object.values(selectedDay.platforms).map(p => p.text).join(' ') 
      : '';
    
    const hasAstmText = /ASTM/i.test(allText);
    const hasFobText = /FOB/i.test(allText);
    const hasOriginText = /origin|colombia|usa|miami|import|warehouse/i.test(allText);

    return {
      hasAstmWarning: hasAstmText && !hasAstmWarningInList,
      includesFobTerms: hasFobText && !hasFobWarningInList,
      disclosesOrigin: hasOriginText,
      bilingualDoubleReview: allWarnings.every(w => !/bilingual|double-review/i.test(w)),
      noUnverifiedClaims: allWarnings.every(w => !/unverified|claim/i.test(w))
    };
  };

  const checklist = getInitialChecklist();

  const handleToggleCheck = (key: 'hasAstmWarning' | 'includesFobTerms' | 'disclosesOrigin' | 'bilingualDoubleReview' | 'noUnverifiedClaims') => {
    if (!onUpdateDay) return;

    const nextChecklist = {
      ...checklist,
      [key]: !checklist[key]
    };

    // Calculate new warnings list
    let newWarnings = [...(selectedDay.accuracyWarnings || [])];

    const warningMessages = {
      hasAstmWarning: {
        en: "Compliance Check: Claims for 'Waterproof' or polymer elements must list specific ASTM safety ratings to comply with building standards.",
        es: "Control de Cumplimiento: Los reclamos de 'Impermeabilidad' o polímeros deben incluir clasificaciones ASTM específicas para cumplir con las normas de construcción."
      },
      includesFobTerms: {
        en: "Compliance Check: Logistic posts must explicitly outline FOB shipping terms (e.g., FOB Miami / origin) for commercial transparency.",
        es: "Control de Cumplimiento: Las publicaciones de logística deben detallar los términos de envío FOB (ej. FOB Miami / origen) para transparencia comercial."
      },
      disclosesOrigin: {
        en: "Compliance Check: Disclosures must declare the country of origin or regional customs warehouse for imported structural materials.",
        es: "Control de Cumplimiento: Las divulgaciones deben declarar el país de origen o el almacén de aduanas regional para materiales importados."
      },
      bilingualDoubleReview: {
        en: "Compliance Check: Content is pending formal bilingual double-review safety alignment for both US and regional regulations.",
        es: "Control de Cumplimiento: El contenido está pendiente de la alineación de seguridad bilingüe formal para regulaciones de EE.UU. y regionales."
      },
      noUnverifiedClaims: {
        en: "Compliance Check: Unverified structural or load-bearing statements must be cleared to avoid structural engineering liability.",
        es: "Control de Cumplimiento: Se deben eliminar las afirmaciones de resistencia estructural o de carga no verificadas para evitar responsabilidad de ingeniería."
      }
    };

    const msg = language === 'EN' ? warningMessages[key].en : warningMessages[key].es;
    const oppositeMsg = language === 'EN' ? warningMessages[key].es : warningMessages[key].en;

    if (nextChecklist[key]) {
      // Checked (Passed) - remove this warning and keyword-related warnings from original list
      newWarnings = newWarnings.filter(w => {
        const isTargetMsg = w === msg || w === oppositeMsg;
        const containsKeyword = (key === 'hasAstmWarning' && /ASTM|waterproof/i.test(w)) ||
                                (key === 'includesFobTerms' && /FOB/i.test(w)) ||
                                (key === 'disclosesOrigin' && /origin|warehouse/i.test(w)) ||
                                (key === 'bilingualDoubleReview' && /bilingual|double-review/i.test(w)) ||
                                (key === 'noUnverifiedClaims' && /unverified|claim/i.test(w));
        return !isTargetMsg && !containsKeyword;
      });
    } else {
      // Unchecked (Failed) - add warning
      if (!newWarnings.some(w => w === msg || w === oppositeMsg)) {
        newWarnings.push(msg);
      }
    }

    // Determine new status
    let nextStatus: 'empty' | 'generated' | 'reviewed' | 'warning' = 'warning';
    const allChecked = Object.values(nextChecklist).every(v => v === true);
    if (allChecked && newWarnings.length === 0) {
      nextStatus = 'reviewed';
    } else if (newWarnings.length > 0) {
      nextStatus = 'warning';
    } else {
      nextStatus = 'generated';
    }

    const updatedDay: DayData = {
      ...selectedDay,
      status: nextStatus,
      accuracyWarnings: newWarnings,
      complianceChecks: nextChecklist
    };

    onUpdateDay(updatedDay);
  };

  const showToast = (key: string) => {
    setCopiedState(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedState(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    showToast(key);
  };

  const dayOfWeekName = new Date(selectedDay.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' });
  const dayOfWeekNameES = new Date(selectedDay.date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long' });

  // Get psychological angle description
  const getAngleLabel = (dayNum: number) => {
    const angles = [
      { en: "Planning & Tips", es: "Planificación y Consejos" }, // 0: Sun
      { en: "Motivational Education", es: "Educativo de Inicio de Semana" }, // 1: Mon
      { en: "Product Spotlight", es: "Foco en Producto" }, // 2: Tue
      { en: "Design Inspiration", es: "Inspiración del Diseñador" }, // 3: Wed
      { en: "Thought Leadership", es: "Artículos y Sostenibilidad" }, // 4: Thu
      { en: "Social Proof & Logistic Success", es: "Casos de Éxito y Logística" }, // 5: Fri
      { en: "Aspirational Luxury Lifestyle", es: "Aspiracional de Lujo" } // 6: Sat
    ];
    const dow = new Date(selectedDay.date + 'T12:00:00').getDay();
    return angles[dow] || { en: "General Inspiration", es: "Inspiración General" };
  };

  const currentAngle = getAngleLabel(new Date(selectedDay.date + 'T12:00:00').getDay());

  const handleCopyAll = () => {
    if (!hasContent) return;
    const block = `UNITEC USA DESIGN SOCIAL CONTENT BUNDLE
Date / Fecha: ${selectedDay.date} (${language === 'EN' ? dayOfWeekName : dayOfWeekNameES})
Theme / Tema: ${selectedMonth.themeEN} / ${selectedMonth.themeES}
Niche / Nicho: ${selectedMonth.niche}

=======================================
📸 INSTAGRAM
Content / Contenido:
${posts.instagram.text}

Hashtags:
${posts.instagram.hashtags}

=======================================
💼 LINKEDIN
Content / Contenido:
${posts.linkedin.text}

=======================================
📘 FACEBOOK
Content / Contenido:
${posts.facebook.text}

=======================================
▶️ YOUTUBE
Content / Contenido:
${posts.youtube.text}

=======================================
🎨 AI MIDJOURNEY IMAGE PROMPT
${selectedDay.imagePrompt || ''}
`;
    copyToClipboard(block, 'all');
  };

  return (
    <div className="bg-white border border-[#e5e5df] rounded-xl p-5 text-[#1a1a1a] shadow-sm flex flex-col justify-between h-full">
      {/* Header Info */}
      <div className="border-b border-[#e5e5df] pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-[10px] text-[#c9a961] uppercase tracking-wider font-mono font-bold flex items-center gap-1.5">
              <span>{language === 'EN' ? `Day ${selectedDay.day}` : `Día ${selectedDay.day}`}</span>
              <ChevronRight size={10} className="text-stone-400" />
              <span>{language === 'EN' ? dayOfWeekName : dayOfWeekNameES}</span>
            </div>
            <h4 id="selected-day-detail-header" className="text-lg font-sans font-bold tracking-tight text-[#1a1a1a] mt-0.5">
              {selectedDay.date}
            </h4>
          </div>

          <div className="flex items-center gap-2">
            {hasContent && (
              <button
                id="print-daily-brief-btn"
                onClick={onPrintBrief}
                className="p-2 bg-[#f5f5f0] hover:bg-stone-100 text-[#c9a961] rounded border border-[#e5e5df] transition-colors cursor-pointer"
                title={language === 'EN' ? "Print printer-friendly A4 Daily Brief" : "Imprimir Brief Diario en Formato A4"}
              >
                <Printer size={15} />
              </button>
            )}

            {!hasContent ? (
              <button
                id="generate-todays-content-btn"
                onClick={onGenerateDay}
                className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#2e2e2e] text-white font-sans font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer rounded"
              >
                {language === 'EN' ? "Generate Today's Content" : "Generar Contenido de Hoy"}
              </button>
            ) : (
              <button
                id="regenerate-todays-content-btn"
                onClick={onGenerateDay}
                className="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-700 rounded font-sans font-bold text-xs transition-colors cursor-pointer border border-[#e5e5df]"
              >
                {language === 'EN' ? "Regenerate" : "Regenerar"}
              </button>
            )}
          </div>
        </div>

        {/* Badges / Dynamic Pickers */}
        <div className="mt-3 flex flex-wrap gap-2.5 text-xs">
          {/* Scheduled Date Selector */}
          <div className="flex items-center gap-1.5 bg-[#f5f5f0] border border-[#e5e5df] px-2.5 py-1 rounded text-stone-605">
            <span className="text-stone-450 uppercase font-mono text-[9px] font-bold">
              {language === 'EN' ? 'Publish Date:' : 'Fecha Pub:'}
            </span>
            <input
              id="scheduled-date-selector"
              type="date"
              value={selectedDay.date}
              onChange={(e) => onUpdateDate(e.target.value)}
              className="bg-white border border-[#e5e5df] rounded text-xs font-bold px-1 py-0.5 text-stone-850 outline-none focus:border-[#c9a961]"
            />
          </div>

          <span className="bg-[#f5f5f0] border border-[#e5e5df] px-2.5 py-1.5 rounded text-stone-605 font-medium">
            {language === 'EN' ? 'Theme:' : 'Tema:'} <strong className="text-stone-850 font-bold">{language === 'EN' ? selectedMonth.themeEN : selectedMonth.themeES}</strong>
          </span>
          <span className="bg-[#f5f5f0] border border-[#e5e5df] px-2.5 py-1.5 rounded text-stone-605 font-medium">
            Niche: <strong className="text-[#2d5a4a] font-mono capitalize font-bold">{selectedMonth.niche.replace('-', ' ')}</strong>
          </span>
          <span className="bg-[#f5f5f0] border border-[#e5e5df] px-2.5 py-1.5 rounded text-stone-605 font-medium">
            Angle: <strong className="text-[#c9a961] font-bold">{language === 'EN' ? currentAngle.en : currentAngle.es}</strong>
          </span>
          {selectedDay.toneOfVoice && (
            <span className="bg-[#c9a961]/15 border border-[#c9a961]/35 px-2.5 py-1.5 rounded text-stone-800 font-mono text-[10.5px] font-bold uppercase tracking-wider">
              {language === 'EN' ? 'Tone: ' : 'Tono: '}<strong className="text-stone-900 font-sans font-bold">{selectedDay.toneOfVoice}</strong>
            </span>
          )}
        </div>

        {/* Tone of Voice Selection Toggle Row */}
        <div className="mt-3 border-t border-[#e5e5df] pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-[10px] text-stone-500 uppercase font-mono tracking-wider font-bold">
            {language === 'EN' ? '🤖 Target Tone:' : '🤖 Tono Objetivo:'}
          </span>
          <div className="flex flex-wrap gap-1 bg-[#f5f5f0] p-1 rounded border border-[#e5e5df]">
            {(['Sales-driven', 'Informational', 'Community-centric'] as ToneOfVoice[]).map((t) => {
              const isActive = toneOfVoice === t;
              const labelsEN = {
                'Sales-driven': 'Wholesale ROI',
                'Informational': 'Technical ASTM',
                'Community-centric': 'Local Builders'
              };
              const labelsES = {
                'Sales-driven': 'Comercial ROI',
                'Informational': 'Ficha Técnica',
                'Community-centric': 'Constructor Local'
              };
              return (
                <button
                  key={t}
                  id={`tone-select-btn-${t}`}
                  onClick={() => onToneOfVoiceChange(t)}
                  className={`px-3 py-1 text-[11px] font-sans font-bold rounded cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#1a1a1a] text-[#c9a961] shadow-sm'
                      : 'text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {language === 'EN' ? labelsEN[t] : labelsES[t]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {!hasContent ? (
        <div className="flex-1 py-12 flex flex-col items-center justify-center text-center">
          <FileText size={36} className="text-stone-300 mb-2" />
          <p className="text-xs text-stone-500 max-w-xs font-medium leading-relaxed">
            {language === 'EN'
              ? 'There is currently no generated content for this calendar day. Click the button above to dynamically assemble and analyze materials according to UNITEC specifiers guidelines.'
              : 'Actualmente no hay contenido generado para este día. Presione el botón de arriba para estructurar y analizar materiales arquitectónicos automáticamente.'}
          </p>
        </div>
      ) : (
        <div className="flex-1 mt-4 flex flex-col">
          {/* Colombia Holiday Conflict warning banner */}
          {integrateColombiaHolidays && selectedDay && COLOMBIAN_HOLIDAYS_2026[selectedDay.date] && (
            <div className="bg-rose-50 border border-rose-200 rounded p-3 mb-4 text-xs text-rose-950 animate-fadeIn">
              <div className="flex items-center gap-1.5 font-sans font-bold mb-1">
                <span className="text-sm">🇨🇴</span>
                <span className="text-rose-800">
                  {language === 'EN' ? 'Colombian Bank Closure Alert' : 'Alerta de Cierre Bancario en Colombia'}
                </span>
              </div>
              <p className="text-[11px] text-rose-700 font-medium font-sans leading-normal">
                {language === 'EN'
                  ? `Today's date is a recognized Colombian holiday (${COLOMBIAN_HOLIDAYS_2026[selectedDay.date].en} / ${COLOMBIAN_HOLIDAYS_2026[selectedDay.date].es}). Regional custom warehouses, administrative offices, and credit institutions are inactive. Scheduling social posts during these closures is discouraged.`
                  : `La fecha es un festivo nacional en Colombia (${COLOMBIAN_HOLIDAYS_2026[selectedDay.date].es} / ${COLOMBIAN_HOLIDAYS_2026[selectedDay.date].en}). Las aduanas, despachos y bancos colombianos están inactivos. Se desaconseja programar publicaciones de interacción durante este cierre.`}
              </p>
            </div>
          )}

          {/* Validation Banner / Double-Review system warnings */}
          {warnings.length > 0 ? (
            <div className="bg-amber-400/10 border border-amber-500/20 rounded p-3 mb-4 text-xs text-amber-900">
              <div className="flex items-center gap-1.5 font-sans font-bold mb-1">
                <AlertTriangle size={14} className="text-amber-650 flex-shrink-0 animate-pulse" />
                {language === 'EN' ? 'Double-Review compliance issues flagged:' : 'Problemas de cumplimiento detectados:'}
              </div>
              <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-amber-850 font-medium">
                {warnings.map((w, idx) => <li key={idx}>{w}</li>)}
              </ul>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-3 mb-4 text-xs text-emerald-800 flex items-center gap-2 font-medium">
              <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
              <div>
                <span className="font-bold block sm:inline text-emerald-900">
                  {language === 'EN' ? 'Approved:' : 'Aprobado:'}
                </span>{' '}
                {language === 'EN'
                  ? "This day's content successfully passed our 2026 bilingual double-review safety standards with zero regulatory remarks."
                  : "El contenido de este día pasó con éxito las normas de seguridad de doble revisión bilingües de 2026 con cero observaciones regulatorias."}
              </div>
            </div>
          )}

          {/* AI Sentiment Intensity & Balanced Messaging Panel */}
          {selectedDay.sentimentAnalysis && (
            <div className="bg-[#fcfbf7] border border-[#e5e5df] rounded-xl p-4 mb-4 space-y-3 shadow-sm animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#e5e5df] pb-2">
                <span className="text-xs font-sans font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={15} className="text-[#c9a961]" />
                  {language === 'EN' ? 'AI Tone & Sentiment Balance Analysis' : 'Análisis IA de Equilibrio de Tono y Sentimiento'}
                </span>
                <span className={`text-[10px] font-sans font-extrabold px-2 py-0.5 rounded-full border tracking-wide uppercase ${
                  selectedDay.sentimentAnalysis.intensity === 'High'
                    ? 'bg-rose-100 text-rose-700 border-rose-200'
                    : selectedDay.sentimentAnalysis.intensity === 'Medium'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>
                  {selectedDay.sentimentAnalysis.intensity} {language === 'EN' ? 'Intensity' : 'Intensidad'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div className="space-y-1">
                  <div className="text-xs font-sans font-bold text-stone-900">
                    {selectedDay.sentimentAnalysis.label}
                  </div>
                  <p className="text-[11px] text-stone-500 font-sans leading-relaxed">
                    <strong>{language === 'EN' ? 'Primary Emotion:' : 'Emoción Primaria:'}</strong> {selectedDay.sentimentAnalysis.primaryEmotion}. <br />
                    {language === 'EN' 
                      ? "Calculated by evaluating active promotional CTAs versus structural/informational specifications to ensure posts remain highly balanced and do not cause audience fatigue."
                      : "Calculado mediante la evaluación de llamados a la acción comerciales frente a las especificaciones técnicas para garantizar la máxima interacción sin fatiga de la audiencia."}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-2.5 bg-stone-100/50 rounded-lg border border-[#e5e5df] min-w-[105px] text-center self-start sm:self-center">
                  <span className="text-[9px] font-mono text-stone-400 font-bold uppercase">{language === 'EN' ? 'INTENSITY SCORE' : 'PUNTUACIÓN'}</span>
                  <span className="text-xl font-sans font-extrabold text-stone-800 mt-0.5">{selectedDay.sentimentAnalysis.score}%</span>
                  <div className="w-16 h-1.5 bg-stone-200 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        selectedDay.sentimentAnalysis.intensity === 'High'
                          ? 'bg-rose-500'
                          : selectedDay.sentimentAnalysis.intensity === 'Medium'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                      }`} 
                      style={{ width: `${selectedDay.sentimentAnalysis.score}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bilingual Compliance Checklist Section */}
          <div className="bg-stone-50 border border-[#e5e5df] rounded-xl p-4 mb-4 space-y-3 shadow-sm animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#e5e5df] pb-2">
              <span className="text-xs font-sans font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
                <ClipboardList size={15} className="text-[#c9a961]" />
                {language === 'EN' ? 'Regulatory Compliance Checklist' : 'Lista de Cumplimiento Regulatorio'}
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#c9a961]/10 text-[#c9a961] px-2 py-0.5 rounded border border-[#c9a961]/25">
                {Object.values(checklist).filter(Boolean).length} / 5 {language === 'EN' ? 'PASSED' : 'APROBADO'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              {/* Checkbox 1: ASTM Warning */}
              <label 
                id="compliance-check-astm-label"
                className="flex items-start gap-3 p-2.5 rounded-lg border border-[#e5e5df] bg-white hover:bg-stone-50/50 transition-all cursor-pointer select-none"
              >
                <input
                  id="compliance-check-astm-checkbox"
                  type="checkbox"
                  checked={checklist.hasAstmWarning}
                  onChange={() => handleToggleCheck('hasAstmWarning')}
                  className="mt-0.5 h-4 w-4 rounded border-stone-300 text-[#c9a961] focus:ring-[#c9a961] cursor-pointer"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-sans font-bold text-stone-900 block">
                    {language === 'EN' ? 'Has ASTM warning' : 'Tiene advertencia ASTM'}
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium block leading-relaxed">
                    {language === 'EN' 
                      ? 'Lists building wind-load or impact-rated specs.' 
                      : 'Especificaciones de carga de viento o impacto.'}
                  </span>
                </div>
              </label>

              {/* Checkbox 2: FOB Terms */}
              <label 
                id="compliance-check-fob-label"
                className="flex items-start gap-3 p-2.5 rounded-lg border border-[#e5e5df] bg-white hover:bg-stone-50/50 transition-all cursor-pointer select-none"
              >
                <input
                  id="compliance-check-fob-checkbox"
                  type="checkbox"
                  checked={checklist.includesFobTerms}
                  onChange={() => handleToggleCheck('includesFobTerms')}
                  className="mt-0.5 h-4 w-4 rounded border-stone-300 text-[#c9a961] focus:ring-[#c9a961] cursor-pointer"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-sans font-bold text-stone-900 block">
                    {language === 'EN' ? 'Includes FOB terms' : 'Incluye términos FOB'}
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium block leading-relaxed">
                    {language === 'EN' 
                      ? 'Outlines FOB Miami shipping / logistics origin.' 
                      : 'Detalla términos FOB Miami para logística.'}
                  </span>
                </div>
              </label>

              {/* Checkbox 3: Country of Origin */}
              <label 
                id="compliance-check-origin-label"
                className="flex items-start gap-3 p-2.5 rounded-lg border border-[#e5e5df] bg-white hover:bg-stone-50/50 transition-all cursor-pointer select-none"
              >
                <input
                  id="compliance-check-origin-checkbox"
                  type="checkbox"
                  checked={checklist.disclosesOrigin}
                  onChange={() => handleToggleCheck('disclosesOrigin')}
                  className="mt-0.5 h-4 w-4 rounded border-stone-300 text-[#c9a961] focus:ring-[#c9a961] cursor-pointer"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-sans font-bold text-stone-900 block">
                    {language === 'EN' ? 'Discloses material origin' : 'Revela origen de material'}
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium block leading-relaxed">
                    {language === 'EN' 
                      ? 'Declares imported warehouse source origins.' 
                      : 'Declara el origen de almacenes de importación.'}
                  </span>
                </div>
              </label>

              {/* Checkbox 4: Bilingual Double Review */}
              <label 
                id="compliance-check-bilingual-label"
                className="flex items-start gap-3 p-2.5 rounded-lg border border-[#e5e5df] bg-white hover:bg-stone-50/50 transition-all cursor-pointer select-none"
              >
                <input
                  id="compliance-check-bilingual-checkbox"
                  type="checkbox"
                  checked={checklist.bilingualDoubleReview}
                  onChange={() => handleToggleCheck('bilingualDoubleReview')}
                  className="mt-0.5 h-4 w-4 rounded border-stone-300 text-[#c9a961] focus:ring-[#c9a961] cursor-pointer"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-sans font-bold text-stone-900 block">
                    {language === 'EN' ? 'Bilingual double-review' : 'Doble revisión bilingüe'}
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium block leading-relaxed">
                    {language === 'EN' 
                      ? 'Verifies regulatory alignment in both languages.' 
                      : 'Alineación regulatoria en ambos idiomas.'}
                  </span>
                </div>
              </label>

              {/* Checkbox 5: No Unverified Claims */}
              <label 
                id="compliance-check-unverified-label"
                className="flex items-start gap-3 p-2.5 rounded-lg border border-[#e5e5df] bg-white hover:bg-stone-50/50 transition-all cursor-pointer select-none md:col-span-2"
              >
                <input
                  id="compliance-check-unverified-checkbox"
                  type="checkbox"
                  checked={checklist.noUnverifiedClaims}
                  onChange={() => handleToggleCheck('noUnverifiedClaims')}
                  className="mt-0.5 h-4 w-4 rounded border-stone-300 text-[#c9a961] focus:ring-[#c9a961] cursor-pointer"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-sans font-bold text-stone-900 block">
                    {language === 'EN' ? 'No unverified structural claims' : 'Sin afirmaciones estructurales sin sustento'}
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium block leading-relaxed">
                    {language === 'EN' 
                      ? 'Checks that statements about load capacity or performance are backed.' 
                      : 'Verifica que afirmaciones de carga o desempeño estén sustentadas.'}
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Social Tabs */}
          <div className="flex border-b border-[#e5e5df] text-xs">
            <button
              id="ig-tab"
              onClick={() => setActiveTab('instagram')}
              className={`flex items-center gap-1.5 py-2.5 px-4 cursor-pointer font-sans transition-all ${activeTab === 'instagram' ? 'text-[#c9a961] border-b-2 border-b-[#c9a961] font-bold' : 'text-stone-505 hover:text-stone-800 font-medium'}`}
            >
              <Instagram size={14} className={activeTab === 'instagram' ? 'text-[#c9a961]' : 'text-stone-400'} />
              Instagram
            </button>
            <button
              id="li-tab"
              onClick={() => setActiveTab('linkedin')}
              className={`flex items-center gap-1.5 py-2.5 px-4 cursor-pointer font-sans transition-all ${activeTab === 'linkedin' ? 'text-[#c9a961] border-b-2 border-b-[#c9a961] font-bold' : 'text-stone-505 hover:text-stone-800 font-medium'}`}
            >
              <Linkedin size={14} className={activeTab === 'linkedin' ? 'text-[#c9a961]' : 'text-stone-400'} />
              LinkedIn
            </button>
            <button
              id="fb-tab"
              onClick={() => setActiveTab('facebook')}
              className={`flex items-center gap-1.5 py-2.5 px-4 cursor-pointer font-sans transition-all ${activeTab === 'facebook' ? 'text-[#c9a961] border-b-2 border-b-[#c9a961] font-bold' : 'text-stone-505 hover:text-stone-800 font-medium'}`}
            >
              <Facebook size={14} className={activeTab === 'facebook' ? 'text-[#c9a961]' : 'text-stone-400'} />
              Facebook
            </button>
            <button
              id="yt-tab"
              onClick={() => setActiveTab('youtube')}
              className={`flex items-center gap-1.5 py-2.5 px-4 cursor-pointer font-sans transition-all ${activeTab === 'youtube' ? 'text-[#c9a961] border-b-2 border-b-[#c9a961] font-bold' : 'text-stone-505 hover:text-stone-800 font-medium'}`}
            >
              <Youtube size={14} className={activeTab === 'youtube' ? 'text-[#c9a961]' : 'text-stone-400'} />
              YouTube
            </button>
          </div>

          {/* Social Box Content */}
          <div className="bg-[#f5f5f0] border border-[#e5e5df] border-t-0 rounded-b p-4 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Dynamic Time Input for current platform */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white border border-[#e5e5df] rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-stone-500 font-mono font-bold uppercase">
                    {language === 'EN' ? 'Suggested Post Time:' : 'Hora Sugerida:'}
                  </span>
                  <input
                    id={`schedule-time-input-${activeTab}`}
                    type="text"
                    value={selectedDay.publishingTimes?.[activeTab] || defaultTimes[activeTab]}
                    onChange={(e) => onUpdateTime(activeTab, e.target.value)}
                    className="bg-stone-50 hover:bg-stone-100 border border-[#e5e5df] hover:border-stone-350 font-mono text-xs font-bold px-2 py-1 rounded w-32 outline-none text-[#1a1a1a] focus:bg-white focus:border-[#c9a961]"
                  />
                </div>
                <div className="text-[10px] text-stone-400 font-medium">
                  {language === 'EN' ? 'Suffix appended:' : 'Sufijo añadido:'}{' '}
                  <code className="bg-stone-105 text-[#c9a961] font-bold px-1.5 py-0.5 rounded text-[10px]">
                    Suggested Posting Time: ...
                  </code>
                </div>
              </div>

              <div className="flex items-center justify-between text-stone-400 text-[10px] font-mono uppercase font-bold">
                <span>{language === 'EN' ? 'Copywriting Output • Draft Content' : 'Redacción • Copia de Trabajo'}</span>
                <span className="flex items-center gap-2">
                  <span>
                    {language === 'EN' 
                      ? `Count: ${posts[activeTab]?.charCount || 0} characters` 
                      : `Caracteres: ${posts[activeTab]?.charCount || 0}`}
                  </span>
                </span>
              </div>

              {/* Text Body */}
              <div
                id={`preview-editor-${activeTab}`}
                className="text-stone-800 text-sm whitespace-pre-wrap font-sans leading-relaxed select-text bg-white p-3 rounded border border-[#e5e5df] font-light max-h-[305px] overflow-y-auto"
              >
                {posts[activeTab]?.text}
              </div>

              {/* Hashtag Block */}
              {activeTab !== 'linkedin' && posts[activeTab]?.hashtags && (
                <div className="space-y-1">
                  <div className="text-[10px] text-stone-400 uppercase font-mono font-bold">
                    {language === 'EN' ? 'Hashtag Segment:' : 'Segmento de Hashtags:'}
                  </div>
                  <div className="text-xs text-stone-600 font-mono select-text bg-white p-2 rounded border border-[#e5e5df] leading-relaxed font-medium">
                    {posts[activeTab].hashtags}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#e5e5df]">
              <div className="flex items-center gap-2">
                <button
                  id={`copy-social-${activeTab}`}
                  onClick={() => copyToClipboard(posts[activeTab]?.text + (activeTab !== 'linkedin' ? `\n\n${posts[activeTab]?.hashtags || ''}` : ''), activeTab)}
                  className="px-3.5 py-1.5 bg-[#c9a961]/15 text-[#c9a961] hover:bg-[#c9a961]/25 font-sans font-bold text-xs rounded transition-all flex items-center gap-1.5 border border-[#c9a961]/35 cursor-pointer"
                >
                  {copiedState[activeTab] ? <Check size={12} /> : <Copy size={12} />}
                  {copiedState[activeTab] 
                    ? (language === 'EN' ? 'Copied!' : '¡Copiado!') 
                    : (language === 'EN' ? `Copy ${activeTab.toUpperCase()}` : `Copiar ${activeTab.toUpperCase()}`)}
                </button>

                {activeTab !== 'linkedin' && posts[activeTab]?.hashtags && (
                  <button
                    id={`copy-hashtags-${activeTab}`}
                    onClick={() => copyToClipboard(posts[activeTab].hashtags, `${activeTab}-hashtags`)}
                    className="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-600 hover:text-stone-800 font-sans font-bold text-xs rounded transition-all flex items-center gap-1 border border-[#e5e5df] cursor-pointer"
                  >
                    {copiedState[`${activeTab}-hashtags`] ? <Check size={12} /> : <Copy size={12} />}
                    {language === 'EN' ? 'Copy Hashtags' : 'Copiar Hashtags'}
                  </button>
                )}
              </div>

              <button
                id="copy-all-platforms-btn"
                onClick={handleCopyAll}
                className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-[#2e2e2e] text-white border border-[#1a1a1a] rounded text-xs transition-all flex items-center gap-1 font-bold cursor-pointer"
              >
                {copiedState['all'] ? <Check size={12} /> : <Copy size={12} />}
                {copiedState['all'] 
                  ? (language === 'EN' ? 'Copied Bundle!' : '¡Paquete Copiado!') 
                  : (language === 'EN' ? 'Copy All Platforms' : 'Copiar todo el Paquete')}
              </button>
            </div>
          </div>

          {/* AI Image Generation Prompt */}
          <div className="mt-4 bg-[#2d5a4a]/10 border border-[#2d5a4a]/20 rounded p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#2d5a4a] font-mono uppercase tracking-widest flex items-center gap-1 font-bold">
                🎨 {language === 'EN' ? 'AI Studio Visual Generator Prompt (Midjourney / Flux Vibe)' : 'Directriz del Generador Visual de IA (Estilo Midjourney / Flux)'}
              </span>
              <button
                id="copy-image-prompt-btn"
                onClick={() => copyToClipboard(selectedDay.imagePrompt || '', 'image')}
                className="text-[10.5px] text-[#c9a961] hover:text-white transition-colors uppercase tracking-wider font-bold font-mono flex items-center gap-1 bg-white hover:bg-[#c9a961] px-2 py-0.5 rounded border border-[#c9a961]/30 cursor-pointer"
              >
                {copiedState['image'] ? <Check size={10} /> : <Copy size={10} />}
                {language === 'EN' ? 'Copy Visual Prompt' : 'Copiar Prompt Visual'}
              </button>
            </div>
            <p className="text-xs text-stone-700 italic leading-relaxed select-text font-serif font-medium">
              "{selectedDay.imagePrompt}"
            </p>
          </div>

          {/* Content Status Workflow Board */}
          <div className="mt-4 border-t border-[#e5e5df] pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="text-stone-750 font-bold font-sans">
              {language === 'EN' ? 'Compliance Workflow Status:' : 'Estado de Aprobación de Regulación:'}
            </div>
            <div className="flex gap-2">
              <button
                id="mark-day-reviewed-btn"
                onClick={() => onUpdateDayStatus('reviewed')}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer font-sans font-bold flex items-center gap-1 ${selectedDay.status === 'reviewed' ? 'bg-emerald-600 text-white font-semibold' : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-[#e5e5df]'}`}
              >
                <Check size={12} />
                {language === 'EN' ? 'Mark Reviewed & Approved' : 'Aprobar Publicación'}
              </button>
              <button
                id="mark-day-flagged-btn"
                onClick={() => onUpdateDayStatus('warning')}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer font-sans font-bold flex items-center gap-1 ${selectedDay.status === 'warning' ? 'bg-amber-500 text-stone-950 shadow-sm' : 'bg-stone-50 text-stone-605 hover:bg-stone-100 border border-[#e5e5df]'}`}
              >
                <Flag size={12} />
                {language === 'EN' ? 'Flag for Verification' : 'Marcar para Verificación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
