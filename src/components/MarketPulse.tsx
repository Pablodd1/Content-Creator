/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Activity, 
  Settings, 
  Save, 
  CheckCircle, 
  Database, 
  Sparkles, 
  RefreshCw, 
  TrendingUp, 
  BarChart3, 
  Globe2 
} from 'lucide-react';
import { MarketPulseData, ApiKeysConfig, MonthData, DayData } from '../types';

interface MarketPulseProps {
  currentTrend: MarketPulseData;
  apiConfigs: ApiKeysConfig;
  onSaveConfigs: (configs: ApiKeysConfig) => void;
  language: 'EN' | 'ES';
  activeMonth?: MonthData;
  selectedDay?: DayData | null;
}

interface DailyResearchInfo {
  themeES: string;
  themeEN: string;
  insightES: string;
  insightEN: string;
  keywords: string[];
  searchScore: number;
  regionalHotspot: string;
  competitiveScore: string;
}

interface SynthesizedBrief {
  titleES: string;
  titleEN: string;
  summaryES: string;
  summaryEN: string;
  opportunitiesES: string[];
  opportunitiesEN: string[];
  timestamp: string;
}

const getDailyResearch = (
  activeMonth: MonthData | undefined,
  selectedDay: DayData | null | undefined
): DailyResearchInfo => {
  if (!activeMonth || !selectedDay) {
    return {
      themeES: "Análisis General de WPC",
      themeEN: "General WPC Analysis",
      insightES: "Foco en el cumplimiento regulatorio de revestimientos con estándares contra incendios.",
      insightEN: "Focus on regulatory fire-safety standard compliance for claddings.",
      keywords: ["#WPCColombia", "#panelesacanalados", "#diseñointerior"],
      searchScore: 78,
      regionalHotspot: "Bogotá, Colombia",
      competitiveScore: "Medio / Medium"
    };
  }

  const dayNum = selectedDay.day;
  const rawNiche = activeMonth.niche || 'general';
  
  // Deterministic calculation based on day + month for reliable values
  const searchScore = 65 + ((dayNum * 7 + activeMonth.monthIndex * 13) % 31);
  const competitiveScore = (dayNum + activeMonth.monthIndex) % 3 === 0 ? "Alta / High" : (dayNum + activeMonth.monthIndex) % 3 === 1 ? "Media / Medium" : "Baja / Low";
  
  const regions = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Miami", "Cartagena"];
  const regionalHotspot = regions[(dayNum + activeMonth.monthIndex) % regions.length] + ", " + ((dayNum + activeMonth.monthIndex) % 2 === 0 ? "CO" : "USA");

  const monthThemeES = activeMonth.themeES;
  const monthThemeEN = activeMonth.themeEN;

  let themeES = `${monthThemeES} • Día ${dayNum}`;
  let themeEN = `${monthThemeEN} • Day ${dayNum}`;
  let insightES = "";
  let insightEN = "";
  let keywords: string[] = [];

  if (rawNiche.includes("sustainability")) {
    themeES = `Sostenibilidad & Eco-Construcción • ${monthThemeES}`;
    themeEN = `Sustainability & Eco-Construction • ${monthThemeEN}`;
    insightES = `Constructoras en ${regionalHotspot} buscan activamente maderas plásticas reciclables con certificación verde FSC para cumplir con regulaciones locales.`;
    insightEN = `Developers in ${regionalHotspot} are actively sourcing recyclable wood-plastic composites with FSC green certification to meet local sustainability codes.`;
    keywords = ["#revestimientoSostenible", "#WPCVerde", "#FSCWood", "#ConstruccionSostenible"];
  } else if (rawNiche.includes("waterproof") || rawNiche.includes("science")) {
    themeES = `Resistencia de Materiales • ${monthThemeES}`;
    themeEN = `Material Science & Waterproofing • ${monthThemeEN}`;
    insightES = `Alta humedad en ${regionalHotspot} impulsa búsquedas de perfiles de PVC coextruidos con cero absorción de agua para evitar hongos y plagas de termitas.`;
    insightEN = `High relative humidity in ${regionalHotspot} drives search velocity for co-extruded PVC profiles with zero water absorption to avoid mildew and termite damage.`;
    keywords = ["#PVCImpermeable", "#AntiMoho", "#Coextrusion", "#ClimaSubtropical"];
  } else if (rawNiche.includes("wallpaper") || rawNiche.includes("trends")) {
    themeES = `Tendencias Interiores • ${monthThemeES}`;
    themeEN = `Interior Surface Aesthetics • ${monthThemeEN}`;
    insightES = `Diseñadores de interiores de alta gama eligen revestimientos decorativos SPC de gran formato con bordes dorados para paneles de televisión en áreas de ${regionalHotspot}.`;
    insightEN = `High-end interior designers in ${regionalHotspot} are selecting large-format decor SPC panel wall sheets with gilded-accent edges for feature media backdrops.`;
    keywords = ["#PanelesDecorativos", "#SPCPremium", "#BordesDorados", "#Tendencias2026"];
  } else if (rawNiche.includes("construction") || rawNiche.includes("tech")) {
    themeES = `Tecnología e Instalación en Obra • ${monthThemeES}`;
    themeEN = `Construction Tech & Installation • ${monthThemeEN}`;
    insightES = `La escasez de mano de obra en ${regionalHotspot} impulsa la adopción de revestimientos acanalados con juntas clic de instalación un 40% más veloz.`;
    insightEN = `Labor availability constraints in ${regionalHotspot} accelerate adoption of tongue-and-groove click WPC cladding, shrinking installation cycles by 40%.`;
    keywords = ["#InstalacionRapida", "#ClickLock", "#ManoDeObra", "#EficienciaConstructiva"];
  } else if (rawNiche.includes("logistics")) {
    themeES = `Canales de Logística Mayorista • ${monthThemeES}`;
    themeEN = `Wholesale Logistics & Transport • ${monthThemeEN}`;
    insightES = `Se registra un incremento en consultas de consolidación de contenedores FOB Miami con destino a las aduanas de Colombia para reducir fletes de distribución.`;
    insightEN = `Spike in consolidation container load queries FOB Miami heading for Colombian customs to mitigate high ocean freight transport costs.`;
    keywords = ["#FOBMiami", "#ImportacionDirecta", "#CargaConsolidada", "#PuertosColombia"];
  } else if (rawNiche.includes("architecture")) {
    themeES = `Foco Arquitectónico y Fachadas • ${monthThemeES}`;
    themeEN = `Architecture Focus & Exterior Shells • ${monthThemeEN}`;
    insightES = `Especificadores recomiendan revestimientos exteriores que cuenten con certificación de cargas de vientos fuertes y resistencia a la intemperie UV clase-B según normativas NSR-10.`;
    insightEN = `Specifying engineers recommend exterior facade cladding testing sheets showing wind-load certifications and UV fade resistance under NSR-10 regional parameters.`;
    keywords = ["#FachadasWPC", "#NormasNSR10", "#ResistenciaUV", "#EspecificacionTecnica"];
  } else {
    themeES = `Renovación de Espacios • ${monthThemeES}`;
    themeEN = `Interior Fit-outs and Renovations • ${monthThemeEN}`;
    insightES = `Proyectos de renovación en ${regionalHotspot} priorizan la remodelación limpia de oficinas sin demoliciones de muros, usando sistemas secos de paneles acanalados.`;
    insightEN = `Fast renovation cycles in ${regionalHotspot} choose dry clean office wall remodeling without messy brick plastering using modular interlocking PVC claddings.`;
    keywords = ["#RemodelacionSeca", "#MurosRapidos", "#MaterialesUnitec", "#Renovacion2026"];
  }

  return {
    themeES,
    themeEN,
    insightES,
    insightEN,
    keywords,
    searchScore,
    regionalHotspot,
    competitiveScore
  };
};

export default function MarketPulse({ 
  currentTrend, 
  apiConfigs, 
  onSaveConfigs, 
  language,
  activeMonth,
  selectedDay 
}: MarketPulseProps) {
  const [showConfig, setShowConfig] = useState(false);
  const [openai, setOpenai] = useState(apiConfigs.openai);
  const [perplexity, setPerplexity] = useState(apiConfigs.perplexity);
  const [googleTrends, setGoogleTrends] = useState(apiConfigs.googleTrends);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // States for interactive Daily Market spec synthesis
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesizedBrief, setSynthesizedBrief] = useState<SynthesizedBrief | null>(null);

  // Auto-reset synthesis when selected date changes to ensure alignment
  useEffect(() => {
    setSynthesizedBrief(null);
  }, [selectedDay, activeMonth]);

  const handleSave = () => {
    onSaveConfigs({ openai, perplexity, googleTrends });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const research = getDailyResearch(activeMonth, selectedDay);

  const handleSynthesizeBrief = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      
      const portName = selectedDay && selectedDay.day % 2 === 0 ? 'de Cartagena (Atlántico)' : 'de Buenaventura (Pacífico)';
      
      setSynthesizedBrief({
        titleES: `Informe de Inteligencia • ${research.themeES}`,
        titleEN: `Intelligence Brief • ${research.themeEN}`,
        summaryES: `El análisis diario del tema detecta un nivel de interés de búsqueda del ${research.searchScore}% en el mercado de ${research.regionalHotspot}. Existe una alta demanda comercial de instaladores calificados con sistema clic de instalación rápida. Se recomienda que UNITEC USA Design priorice la colocación de contenedores consolidados WPC/SPC directo a puerto colombiano ${portName} para cubrir la demanda y asegurar una clasificación Clase-B de retardación al fuego.`,
        summaryEN: `Daily theme analysis detects an exceptional ${research.searchScore}% search interest velocity across the ${research.regionalHotspot} trade market. General contractors show prominent demand for rapid click tongue-and-groove composite installers. Direct consolidated container-level material allocation via Colombian port of ${portName} is highly advised to secure maximum job yields and comply with Class-B non-combustibility requirements.`,
        opportunitiesES: [
          `Target prioritario de contratistas en ${research.regionalHotspot} realizando reformas de lujo.`,
          `Posicionamiento técnico de paneles de WPC con acabado natural antimoho en zonas de alta humedad.`,
          `Ofrecer paquetes pre-empacados de perfiles decorativos con bordes dorados para proyectos listos.`
        ],
        opportunitiesEN: [
          `Priority wholesale targeting of local estimators in ${research.regionalHotspot} running residential developments.`,
          `Technical framing of anti-mold subtropical co-extruded panels to displace high-maintenance solid wood.`,
          `Packaging direct accessories (gilded edge profiles) with standard container shipments for full markup capture.`
        ],
        timestamp: new Date().toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', second: '2-digit' })
      });
    }, 1100);
  };

  return (
    <div id="market-pulse-panel" className="bg-[#2d5a4a] border border-[#23473b] rounded-xl p-5 flex flex-col gap-4 text-white shadow-sm h-full">
      {/* Title Header - Spanish First */}
      <div className="flex items-center justify-between border-b border-[#23473b] pb-3">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-[#c9a961] animate-pulse" />
          <h3 className="font-sans font-extrabold text-white text-xs tracking-wide uppercase">
            {language === 'EN' ? 'Market Pulse • Análisis de Mercado' : 'Análisis de Mercado • Market Pulse'}
          </h3>
        </div>
        <button
          id="toggle-pipeline-settings"
          onClick={() => setShowConfig(!showConfig)}
          title={language === 'EN' ? "Configure API keys for live research" : "Configurar API de investigación de mercado"}
          className={`p-1.5 rounded transition-all cursor-pointer ${showConfig ? 'bg-[#c9a961] text-stone-950' : 'hover:bg-[#1e3e33] text-emerald-100 hover:text-white'}`}
        >
          <Settings size={15} />
        </button>
      </div>

      {showConfig ? (
        <div className="space-y-4 animate-fadeIn text-xs">
          <div className="flex items-center justify-between bg-[#1e3e33]/70 p-2.5 rounded border border-[#18342a] text-xs text-emerald-250">
            <span className="flex items-center gap-1.5 font-bold">
              <Database size={12} className="text-[#c9a961]" />
              {language === 'EN' ? 'Research Pipeline API' : 'Pipeline de Investigación Directo'}
            </span>
            <span className="text-[10px] text-[#c9a961] uppercase tracking-wider font-mono font-bold">Sandbox</span>
          </div>

          <p className="text-[11px] text-emerald-100 leading-relaxed font-sans">
            {language === 'EN' 
              ? 'Input private API keys to synchronize current market heuristics with live Google Trends and Perplexity analysis.'
              : 'Inserte sus credenciales privadas de API para sincronizar la heurística actual de mercado con Google Trends y Perplexity en vivo.'}
          </p>

          <div className="space-y-3">
            <div>
              <label htmlFor="openai-api-input" className="block text-[10px] uppercase tracking-wider text-emerald-200 font-mono mb-1 font-bold">
                {language === 'EN' ? 'OpenAI GPT-4o Key' : 'Clave OpenAI GPT-4o'}
              </label>
              <input
                id="openai-api-input"
                type="password"
                placeholder="sk-proj-..."
                value={openai}
                onChange={(e) => setOpenai(e.target.value)}
                className="w-full bg-[#1e3e33] border border-[#18342a] focus:border-[#c9a961] rounded px-3 py-1.5 text-xs text-white outline-none placeholder-emerald-850"
              />
            </div>

            <div>
              <label htmlFor="perplexity-api-input" className="block text-[10px] uppercase tracking-wider text-emerald-200 font-mono mb-1 font-bold">
                {language === 'EN' ? 'Perplexity Sonar key' : 'Clave Perplexity Sonar'}
              </label>
              <input
                id="perplexity-api-input"
                type="password"
                placeholder="pplx-..."
                value={perplexity}
                onChange={(e) => setPerplexity(e.target.value)}
                className="w-full bg-[#1e3e33] border border-[#18342a] focus:border-[#c9a961] rounded px-3 py-1.5 text-xs text-white outline-none placeholder-emerald-850"
              />
            </div>

            <div>
              <label htmlFor="google-trends-input" className="block text-[10px] uppercase tracking-wider text-emerald-200 font-mono mb-1 font-bold">
                {language === 'EN' ? 'Google Trends SERP API ID' : 'ID de API Google Trends SERP'}
              </label>
              <input
                id="google-trends-input"
                type="password"
                placeholder="g-trends-auth..."
                value={googleTrends}
                onChange={(e) => setGoogleTrends(e.target.value)}
                className="w-full bg-[#1e3e33] border border-[#18342a] focus:border-[#c9a961] rounded px-3 py-1.5 text-xs text-white outline-none placeholder-emerald-850"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-[#18342a]">
            <button
              id="save-api-config-btn"
              onClick={handleSave}
              className="flex-1 py-1.5 bg-[#c9a961] hover:bg-[#b09352] text-stone-950 rounded text-[11px] font-bold font-sans uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Save size={12} />
              {language === 'EN' ? 'Save Keys' : 'Guardar Llaves'}
            </button>
            <button
              id="cancel-api-config-btn"
              onClick={() => setShowConfig(false)}
              className="px-3 py-1.5 bg-[#1a382c] hover:bg-[#163026] rounded text-[11px] text-emerald-100 transition-colors cursor-pointer"
            >
              {language === 'EN' ? 'Back' : 'Atrás'}
            </button>
          </div>

          {saveSuccess && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 py-2 rounded animate-slideUp">
              <CheckCircle size={12} />
              {language === 'EN' ? 'API Settings Updated' : 'Configuraciones de API Actualizadas'}
            </div>
          )}
        </div>
      ) : (
        <div id="market-pulse-active-view" className="flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-4.5">
            {/* Daily Research Title Section */}
            <div className="space-y-1 bg-[#1a382c]/40 p-3 rounded-lg border border-[#23473b]">
              <div className="text-[9.5px] text-[#c9a961] uppercase tracking-widest font-mono font-black flex items-center gap-1.5">
                <Globe2 size={11} />
                {language === 'EN' ? 'DAILY SPEC RESEARCH • INVESTIGACIÓN DIARIA DE TEMA' : 'INVESTIGACIÓN DIARIA DE TEMA • DAILY SPEC RESEARCH'}
              </div>
              <h4 id="daily-research-theme" className="text-sm font-sans font-bold text-white tracking-tight leading-tight pt-1">
                {language === 'ES' ? research.themeES : research.themeEN}
              </h4>
            </div>

            {/* Insight Statement */}
            <div className="space-y-1">
              <div className="text-[9.5px] text-emerald-250 uppercase tracking-widest font-mono font-bold">
                {language === 'EN' ? 'MARKET INSIGHT • PANORAMA DE MERCADO' : 'PANORAMA DE MERCADO • MARKET INSIGHT'}
              </div>
              <p id="daily-research-insight" className="text-[11.5px] text-emerald-50 leading-relaxed border-l-2 border-[#c9a961] pl-3 py-0.5 font-sans">
                {language === 'ES' ? research.insightES : research.insightEN}
              </p>
            </div>

            {/* Keyword Opportunities */}
            <div className="space-y-1.5">
              <div className="text-[9.5px] text-emerald-250 uppercase tracking-widest font-mono font-bold">
                {language === 'EN' ? 'TARGET KEYWORDS • PALABRAS CLAVE DIARIAS' : 'PALABRAS CLAVE DIARIAS • TARGET KEYWORDS'}
              </div>
              <div id="daily-research-keywords" className="flex flex-wrap gap-1">
                {research.keywords.map((kw, idx) => (
                  <span key={idx} className="text-[9.5px] text-[#c9a961] font-mono bg-[#1a382c] px-2 py-0.5 rounded border border-[#23473b] font-semibold">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Technical Metrics Bars */}
            <div className="space-y-2 pt-1 border-t border-[#23473b]">
              <div className="text-[9.5px] text-emerald-250 uppercase tracking-widest font-mono font-bold">
                {language === 'EN' ? 'DEMAND METRICS • DATOS DE DEMANDA' : 'DATOS DE DEMANDA • DEMAND METRICS'}
              </div>
              
              <div className="space-y-1.5 text-xs font-sans">
                {/* Search interest metric */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-emerald-100">
                    <span>{language === 'EN' ? 'Search Velocity Index' : 'Índice de Velocidad de Búsqueda'}</span>
                    <span className="font-mono text-[#c9a961] font-bold">{research.searchScore}%</span>
                  </div>
                  <div className="w-full bg-[#1e3e33] h-1.5 rounded-full overflow-hidden flex border border-[#18342a]">
                    <div 
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${research.searchScore}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-stone-200">
                  <span className="text-emerald-200">{language === 'EN' ? 'Peak Target Region:' : 'Región Clave de Venta:'}</span>
                  <span className="font-mono text-white font-black">{research.regionalHotspot}</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-stone-200">
                  <span className="text-emerald-200">{language === 'EN' ? 'Competitive Density:' : 'Densidad de Competencia:'}</span>
                  <span className="font-mono font-bold text-emerald-350">{research.competitiveScore}</span>
                </div>
              </div>
            </div>

            {/* Synthesizer action area */}
            <div className="pt-2">
              {synthesizedBrief ? (
                <div className="bg-white/5 border border-emerald-400/20 p-3 rounded-lg text-xs space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between font-mono text-[9px] text-[#c9a961] uppercase font-bold border-b border-white/5 pb-1.5">
                    <span className="flex items-center gap-1">📋 {language === 'EN' ? 'SYNTHESIZED MEMO' : 'MEMO SINTETIZADO'}</span>
                    <span className="text-[8px] text-stone-400">{synthesizedBrief.timestamp}</span>
                  </div>
                  
                  <div className="space-y-1 bg-[#1a382c]/80 p-2 rounded border border-[#23473b] text-[11px] text-emerald-50 leading-relaxed font-sans">
                    <strong>{language === 'ES' ? synthesizedBrief.titleES : synthesizedBrief.titleEN}</strong>
                    <p className="mt-1">
                      {language === 'ES' ? synthesizedBrief.summaryES : synthesizedBrief.summaryEN}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[9.5px] font-mono text-emerald-200 uppercase font-bold">
                      🎯 {language === 'EN' ? 'Wholesale Angles:' : 'Ángulos Mayoristas:'}
                    </span>
                    <ul className="list-disc pl-3 text-[10px] text-stone-300 space-y-1 font-sans">
                      {(language === 'ES' ? synthesizedBrief.opportunitiesES : synthesizedBrief.opportunitiesEN).map((op, oIdx) => (
                        <li key={oIdx}>{op}</li>
                      ))}
                    </ul>
                  </div>

                  <button
                    id="re-synthesize-brief-btn"
                    onClick={handleSynthesizeBrief}
                    className="w-full py-1 bg-transparent hover:bg-white/5 text-[#c9a961] border border-[#c9a961]/30 rounded text-[10px] font-mono font-bold transition-all uppercase cursor-pointer flex items-center justify-center gap-1"
                  >
                    <RefreshCw size={10} />
                    {language === 'EN' ? 'Update Spec Pulse' : 'Actualizar Pulso de Mercado'}
                  </button>
                </div>
              ) : (
                <button
                  id="synthesize-market-brief-btn"
                  onClick={handleSynthesizeBrief}
                  disabled={isSynthesizing}
                  className="w-full py-2 bg-[#c9a961] hover:bg-[#b09352] disabled:bg-stone-600 disabled:text-stone-300 text-stone-950 rounded text-xs font-sans font-black uppercase tracking-wider transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSynthesizing ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>{language === 'EN' ? 'Synthesizing Spec Brief...' : 'Sintetizando Informe Técnico...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} />
                      <span>{language === 'EN' ? 'Synthesize Spec Brief' : 'Sintetizar Informe de Mercado'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* System status node */}
          <div className="bg-[#1a382c]/65 p-3 rounded border border-[#1e3e33] text-[10.5px] text-emerald-100 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-300 font-mono font-bold text-[9px] uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              API: {language === 'EN' ? 'ACTIVE' : 'ACTIVO'}
            </div>
            <p className="font-light font-sans text-[10px] leading-snug">
              {language === 'EN'
                ? 'Heuristics matched to dynamic selected day content specifications automatically.'
                : 'La heurística está emparejada con las especificaciones del día seleccionado automáticamente.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
