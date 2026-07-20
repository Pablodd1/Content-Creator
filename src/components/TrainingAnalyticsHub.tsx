/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { 
  Settings, 
  BarChart2, 
  Check, 
  RefreshCw, 
  Globe, 
  ArrowUpRight, 
  Database, 
  FileText, 
  Layers, 
  HelpCircle,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { CompanyTrainingConfig, GoogleAnalyticsConfig } from '../types';
import VoiceInputBtn from './VoiceInputBtn';

interface TrainingAnalyticsHubProps {
  trainingConfig: CompanyTrainingConfig;
  analyticsConfig: GoogleAnalyticsConfig;
  onSaveTraining: (config: CompanyTrainingConfig) => void;
  onSaveAnalytics: (config: GoogleAnalyticsConfig) => void;
  onTriggerRebuild: () => void;
  language: 'EN' | 'ES';
}

export default function TrainingAnalyticsHub({
  trainingConfig,
  analyticsConfig,
  onSaveTraining,
  onSaveAnalytics,
  onTriggerRebuild,
  language
}: TrainingAnalyticsHubProps) {
  const [activeHubTab, setActiveHubTab] = useState<'training' | 'analytics' | 'manual'>('training');
  
  // Training form states
  const [companyName, setCompanyName] = useState(trainingConfig.companyName || '');
  const [valueProposition, setValueProposition] = useState(trainingConfig.valueProposition || '');
  const [toneGuide, setToneGuide] = useState(trainingConfig.toneGuide || '');
  const [targetAudience, setTargetAudience] = useState(trainingConfig.targetAudience || '');
  const [customGuidelines, setCustomGuidelines] = useState(trainingConfig.customGuidelines || '');
  const [isSavedTraining, setIsSavedTraining] = useState(false);

  // Analytics states
  const [measurementId, setMeasurementId] = useState(analyticsConfig.measurementId || '');
  const [isConnected, setIsConnected] = useState(analyticsConfig.isConnected || false);
  const [isSavedAnalytics, setIsSavedAnalytics] = useState(false);

  // Sync props to internal state on change
  useEffect(() => {
    setCompanyName(trainingConfig.companyName || '');
    setValueProposition(trainingConfig.valueProposition || '');
    setToneGuide(trainingConfig.toneGuide || '');
    setTargetAudience(trainingConfig.targetAudience || '');
    setCustomGuidelines(trainingConfig.customGuidelines || '');
  }, [trainingConfig]);

  useEffect(() => {
    setMeasurementId(analyticsConfig.measurementId || '');
    setIsConnected(analyticsConfig.isConnected || false);
  }, [analyticsConfig]);

  const handleSaveTrainingForm = (e: FormEvent) => {
    e.preventDefault();
    onSaveTraining({
      companyName,
      valueProposition,
      toneGuide,
      targetAudience,
      customGuidelines
    });
    setIsSavedTraining(true);
    setTimeout(() => setIsSavedTraining(false), 3000);
  };

  const handleSaveAnalyticsForm = (e: FormEvent) => {
    e.preventDefault();
    onSaveAnalytics({
      measurementId,
      isConnected: measurementId.trim().length > 0,
      simulatedViews: analyticsConfig.simulatedViews || 14820,
      simulatedCTR: analyticsConfig.simulatedCTR || 4.2,
      simulatedConversions: analyticsConfig.simulatedConversions || 2.8
    });
    setIsSavedAnalytics(true);
    setTimeout(() => setIsSavedAnalytics(false), 3000);
  };

  const toggleConnection = () => {
    const nextConnected = !isConnected;
    setIsConnected(nextConnected);
    onSaveAnalytics({
      measurementId: nextConnected && !measurementId ? 'G-WPCCOLOMBIA26' : measurementId,
      isConnected: nextConnected,
      simulatedViews: analyticsConfig.simulatedViews || 14820,
      simulatedCTR: analyticsConfig.simulatedCTR || 4.2,
      simulatedConversions: analyticsConfig.simulatedConversions || 2.8
    });
  };

  const isSpanish = language === 'ES';

  return (
    <div id="training-analytics-container-brick" className="bg-white border border-[#e5e5df] rounded-xl text-[#1a1a1a] shadow-sm overflow-hidden flex flex-col">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-5 border-b border-[#e5e5df]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="bg-[#c9a961]/25 text-[#c9a961] border border-[#c9a961]/35 px-2.5 py-1 text-[10px] tracking-widest font-mono rounded font-bold uppercase inline-block mb-1">
              {isSpanish ? 'CONFIGURACIÓN DE MARCA & METRICAS' : 'BRAND INTELLIGENCE & METRICS'}
            </span>
            <h3 className="text-base font-sans font-bold text-white tracking-tight flex items-center gap-2">
              <Settings size={18} className="text-[#c9a961]" />
              {isSpanish ? 'AI Training & Analytics Control Center' : 'AI Training & Analytics Control Board'}
            </h3>
            <p className="text-xs text-stone-400 mt-1 max-w-2xl">
              {isSpanish 
                ? 'Personalice la IA con las directrices específicas de su marca WPC para Colombia, conecte Google Analytics y monitoree el rendimiento.'
                : 'Configure corporate guidelines to train content generation, enter Google Analytics properties, and review visual marketing KPIs.'}
            </p>
          </div>
        </div>

        {/* Inner Hub Navigation Tabs */}
        <div className="flex gap-2 mt-5 border-t border-stone-800 pt-4 overflow-x-auto scrollbar-none">
          <button
            id="tab-hub-training"
            onClick={() => setActiveHubTab('training')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-bold tracking-tight rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeHubTab === 'training'
                ? 'bg-[#c9a961] text-stone-950'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <Database size={13} />
            {isSpanish ? '1. Perfil & Entrenamiento IA' : '1. Brand Profile & AI Training'}
          </button>
          <button
            id="tab-hub-analytics"
            onClick={() => setActiveHubTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-bold tracking-tight rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeHubTab === 'analytics'
                ? 'bg-[#c9a961] text-stone-950'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <BarChart2 size={13} />
            {isSpanish ? '2. Google Analytics & KPIs' : '2. Google Analytics & Metrics'}
          </button>
          <button
            id="tab-hub-manual"
            onClick={() => setActiveHubTab('manual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-bold tracking-tight rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeHubTab === 'manual'
                ? 'bg-[#c9a961] text-stone-950'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <FileText size={13} />
            {isSpanish ? '3. Manual de Uso Paso a Paso' : '3. Step-by-Step Spanish Manual'}
          </button>
        </div>
      </div>

      {/* Main Form/Content Box */}
      <div className="p-6 bg-[#fcfcfb]">
        
        {/* TAB 1: AI BRAND PROFILE & TRAINING */}
        {activeHubTab === 'training' && (
          <form onSubmit={handleSaveTrainingForm} className="space-y-4 animate-fadeIn text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="training-company-name" className="block text-xs uppercase tracking-wider text-stone-500 font-mono font-bold">
                    {isSpanish ? 'Nombre de la Empresa / Marca' : 'Company Name / Brand'}
                  </label>
                  <VoiceInputBtn lang={isSpanish ? 'es-ES' : 'en-US'} onResult={setCompanyName} />
                </div>
                <input
                  id="training-company-name"
                  type="text"
                  placeholder="Ej. WPC Colombia • UNITEC USA"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e5df] rounded bg-white text-[#1a1a1a] text-xs font-sans font-medium focus:outline-none focus:border-[#c9a961]"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="training-audience" className="block text-xs uppercase tracking-wider text-stone-500 font-mono font-bold">
                    {isSpanish ? 'Población / Segmento Objetivo' : 'Target Audience / Market'}
                  </label>
                  <VoiceInputBtn lang={isSpanish ? 'es-ES' : 'en-US'} onResult={setTargetAudience} />
                </div>
                <input
                  id="training-audience"
                  type="text"
                  placeholder="Ej. Arquitectos constructores, mayoristas de madera, especificadores"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e5df] rounded bg-white text-[#1a1a1a] text-xs font-sans font-medium focus:outline-none focus:border-[#c9a961]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="training-value-prop" className="block text-xs uppercase tracking-wider text-stone-500 font-mono font-bold">
                    {isSpanish ? 'Propuesta de Valor Principal (Valor del WPC)' : 'Primary Value Proposition'}
                  </label>
                  <VoiceInputBtn lang={isSpanish ? 'es-ES' : 'en-US'} onResult={setValueProposition} />
                </div>
                <textarea
                  id="training-value-prop"
                  rows={3}
                  placeholder="Ej. Revestimientos co-extruidos libres de mantenimiento, con filtro UV y ranura click para montaje 40% más veloz..."
                  value={valueProposition}
                  onChange={(e) => setValueProposition(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e5df] rounded bg-white text-[#1a1a1a] text-xs font-sans font-medium focus:outline-none focus:border-[#c9a961]"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="training-tone-guide" className="block text-xs uppercase tracking-wider text-stone-500 font-mono font-bold">
                    {isSpanish ? 'Guía de Tono y Vocabulario Técnico' : 'Tone and Style Guide'}
                  </label>
                  <VoiceInputBtn lang={isSpanish ? 'es-ES' : 'en-US'} onResult={setToneGuide} />
                </div>
                <textarea
                  id="training-tone-guide"
                  rows={3}
                  placeholder="Ej. Profesional, directo, sin falsas exageraciones constructivas, enfocado en importación FOB por contenedor."
                  value={toneGuide}
                  onChange={(e) => setToneGuide(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e5df] rounded bg-white text-[#1a1a1a] text-xs font-sans font-medium focus:outline-none focus:border-[#c9a961]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="training-custom-guidelines" className="block text-xs uppercase tracking-wider text-stone-500 font-mono font-bold">
                  {isSpanish ? 'Directrices Especiales & Palabras Claves Obligatorias' : 'Custom Corporate Guidelines'}
                </label>
                <VoiceInputBtn lang={isSpanish ? 'es-ES' : 'en-US'} onResult={setCustomGuidelines} />
              </div>
              <textarea
                id="training-custom-guidelines"
                rows={2}
                placeholder="Ej. Mencionar puertos FOB principales (Cartagena/Buenaventura) y despachos consolidados desde la bodega de Miami."
                value={customGuidelines}
                onChange={(e) => setCustomGuidelines(e.target.value)}
                className="w-full px-3 py-2 border border-[#e5e5df] rounded bg-white text-[#1a1a1a] text-xs font-sans font-medium focus:outline-none focus:border-[#c9a961]"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[#e5e5df]">
              <div className="flex items-center gap-2 text-stone-550 text-xs">
                <UserCheck size={14} className="text-emerald-600" />
                <span>
                  {isSpanish 
                    ? 'Los textos de redes sociales adaptarán estos perfiles tras presionar Generar.' 
                    : 'Generated copy will intelligently weave these profile specifications.'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  id="rebuild-all-content-btn"
                  type="button"
                  onClick={onTriggerRebuild}
                  className="px-4 py-2 border border-[#e5e5df] hover:bg-stone-100 text-[#1a1a1a] font-sans font-bold text-xs tracking-tight rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                  title={isSpanish ? 'Aplica la configuración a todos los meses generados' : 'Apply changes to calendar templates'}
                >
                  <RefreshCw size={13} />
                  {isSpanish ? 'Re-procesar Calendarios' : 'Re-process Calendar Data'}
                </button>
                <button
                  id="save-training-btn"
                  type="submit"
                  className="px-5 py-2 bg-[#c9a961] hover:bg-[#b09352] text-stone-950 font-sans font-bold text-xs tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {isSavedTraining ? <Check size={13} /> : null}
                  {isSavedTraining 
                    ? (isSpanish ? '¡Entrenamiento Guardado!' : 'Training Updated!') 
                    : (isSpanish ? 'Guardar Entrenamiento' : 'Save Training Profile')}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: GOOGLE ANALYTICS INTEGRATION */}
        {activeHubTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn text-left">
            <form onSubmit={handleSaveAnalyticsForm} className="bg-white p-4 border border-[#e5e5df] rounded-lg">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="flex-1">
                  <label htmlFor="ga-measurement-input" className="block text-xs uppercase tracking-wider text-stone-500 font-mono mb-1 font-bold">
                    {isSpanish ? 'ID de Medición de Google Analytics (GA4)' : 'Google Analytics Measurement ID'}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 font-mono text-xs font-bold pointer-events-none">
                      GA-
                    </span>
                    <input
                      id="ga-measurement-input"
                      type="text"
                      placeholder="WPCCOLOMBIA26 o su ID G-XXXXXX"
                      value={measurementId.replace(/^GA-/, '')}
                      onChange={(e) => setMeasurementId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-[#e5e5df] rounded bg-white text-[#1a1a1a] text-xs font-mono font-medium focus:outline-none focus:border-[#c9a961]"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    id="ga-toggle-connection-btn"
                    type="button"
                    onClick={toggleConnection}
                    className={`px-4 py-2 border font-sans font-bold text-xs tracking-tight rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isConnected 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                        : 'border-[#e5e5df] bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Globe size={13} className={isConnected ? 'animate-pulse' : ''} />
                    {isConnected 
                      ? (isSpanish ? '● Conectado (Simulado)' : '● Connected') 
                      : (isSpanish ? 'Conectar' : 'Connect')}
                  </button>
                  <button
                    id="ga-save-btn"
                    type="submit"
                    className="px-5 py-2 bg-[#1a1a1a] hover:bg-stone-850 text-white font-sans font-bold text-xs tracking-wider rounded transition-colors uppercase cursor-pointer"
                  >
                    {isSavedAnalytics ? (isSpanish ? 'Guardado' : 'Saved') : (isSpanish ? 'Aplicar ID' : 'Apply ID')}
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-stone-400 mt-2">
                {isSpanish 
                  ? 'La integración permite monitorear y extraer datos de eventos en tiempo real originados por sus campañas sociales dirigidas a Colombia e internacionales.'
                  : 'Allows tracking campaign outbound traffic, link click counts, and sample box requests.'}
              </p>
            </form>

            {/* Simulated GA Dashboard Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Metric 1 */}
              <div className="bg-white p-4 border border-[#e5e5df] rounded-lg relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400">
                      {isSpanish ? 'Impresiones / Páginas Vistas' : 'Campaign Page Views'}
                    </span>
                    <h4 className="text-2xl font-sans font-extrabold text-[#1a1a1a] mt-1 font-mono">
                      {isConnected ? (analyticsConfig.simulatedViews + 128).toLocaleString() : '---'}
                    </h4>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold flex items-center gap-0.5">
                    <TrendingUp size={10} /> +12%
                  </span>
                </div>
                <div className="w-full bg-stone-100 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: isConnected ? '75%' : '0%' }}></div>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-white p-4 border border-[#e5e5df] rounded-lg relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400">
                      {isSpanish ? 'Tasa de Clics (CTR Social)' : 'Click-Through Rate (CTR)'}
                    </span>
                    <h4 className="text-2xl font-sans font-extrabold text-[#1a1a1a] mt-1 font-mono">
                      {isConnected ? `${analyticsConfig.simulatedCTR}%` : '---'}
                    </h4>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold flex items-center gap-0.5">
                    <TrendingUp size={10} /> +0.4%
                  </span>
                </div>
                <div className="w-full bg-stone-100 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-[#c9a961] h-1.5 rounded-full" style={{ width: isConnected ? '65%' : '0%' }}></div>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="bg-white p-4 border border-[#e5e5df] rounded-lg relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400">
                      {isSpanish ? 'Tasa Conversión (Muestras)' : 'Conversion (Sample Box)'}
                    </span>
                    <h4 className="text-2xl font-sans font-extrabold text-[#1a1a1a] mt-1 font-mono">
                      {isConnected ? `${analyticsConfig.simulatedConversions}%` : '---'}
                    </h4>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold flex items-center gap-0.5">
                    <TrendingUp size={10} /> +1.2%
                  </span>
                </div>
                <div className="w-full bg-stone-100 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-stone-900 h-1.5 rounded-full" style={{ width: isConnected ? '85%' : '0%' }}></div>
                </div>
              </div>
            </div>

            {/* Geographical Splits & Live Event Streaming */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hotspots */}
              <div className="bg-white p-5 border border-[#e5e5df] rounded-lg">
                <h5 className="text-xs font-sans font-bold text-stone-850 uppercase tracking-wider font-mono mb-3">
                  {isSpanish ? '📍 Segmentación de Audiencia Regional' : '📍 Target Demographic Hotspots'}
                </h5>
                <div className="space-y-2.5">
                  {[
                    { city: 'Bogotá (Distrito Capital)', percent: '38%', count: '5,630 visitas' },
                    { city: 'Medellín (Antioquia)', percent: '22%', count: '3,260 visitas' },
                    { city: 'Cali (Valle del Cauca)', percent: '15%', count: '2,220 visitas' },
                    { city: 'Miami / South Florida (Wholesale Hub)', percent: '15%', count: '2,220 visitas' },
                    { city: 'Barranquilla / Costa Atlántica', percent: '10%', count: '1,490 visitas' },
                  ].map((item, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex justify-between text-[11px] font-medium text-stone-600 mb-1">
                        <span>{item.city}</span>
                        <span className="font-mono font-bold text-stone-900">{item.percent} ({item.count})</span>
                      </div>
                      <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-stone-800 h-1 rounded-full" 
                          style={{ width: isConnected ? item.percent : '0%' }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event Streamer */}
              <div className="bg-stone-950 text-emerald-400 p-5 rounded-lg font-mono text-[10.5px] leading-normal shadow-inner relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-stone-500 border-b border-stone-800 pb-2 mb-3">
                    <span className="uppercase text-[9px] font-bold tracking-wider">GA4 Streaming Extraction Buffer</span>
                    <span className="text-[9px] bg-emerald-900/45 text-emerald-400 border border-emerald-800 px-1 rounded animate-pulse">
                      {isConnected ? 'LIVE FEED' : 'IDLE'}
                    </span>
                  </div>
                  <div className="space-y-1.5 select-none h-[110px] overflow-hidden">
                    {isConnected ? (
                      <>
                        <div className="text-stone-400 animate-pulse">[15:02:11] Event: page_view | Ref: instagram_bio | Country: Colombia (Bogota)</div>
                        <div className="text-emerald-500">[15:02:45] Event: click_link | Target: catalog_download_pdf | Client IP: 186.28.XX.XX</div>
                        <div className="text-[#c9a961]">[15:03:12] Event: sample_box_request | WPC_Teak_Pro | City: Medellin (El Poblado)</div>
                        <div className="text-stone-400 font-bold">[15:04:02] Event: lead_form_submission | FOB_Buenaventura_40ft | Company: G&C Constructores</div>
                      </>
                    ) : (
                      <div className="text-stone-500 italic text-center pt-8">
                        {isSpanish 
                          ? 'Ingrese un ID de medición y active la conexión para iniciar la simulación del buffer de extracción.' 
                          : 'Enter a GA4 Measurement ID to listen to inbound tracking logs.'}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center text-stone-500 border-t border-stone-900 pt-2 mt-2">
                  <span>Connection Protocol: SSE-HTTP</span>
                  <span>Port: 3000 / GA-Proxy</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STEP-BY-STEP SPANISH MANUAL */}
        {activeHubTab === 'manual' && (
          <div className="space-y-6 animate-fadeIn text-left text-xs leading-relaxed text-stone-700 bg-white p-6 border border-[#e5e5df] rounded-lg">
            <div>
              <h4 className="text-sm font-sans font-bold text-[#1a1a1a] border-b border-[#e5e5df] pb-2 flex items-center gap-2">
                <FileText size={15} className="text-[#c9a961]" />
                Manual Técnico de Tránsito de Mercancías, Logística Portuaria y Generación de Contenido IA
              </h4>
              <p className="text-stone-500 mt-1">
                Este manual establece las directrices estandarizadas para el tránsito aduanero de compuestos de madera plástica (WPC) hacia Colombia, y el uso coordinado de la suite de inteligencia artificial para la generación automática de video (Runway Gen-3).
              </p>
            </div>

            <div className="space-y-6">
              {/* Sección 1: Tránsito, Logística Portuaria y cubicaje */}
              <div className="border-l-2 border-[#c9a961] pl-4 space-y-2">
                <h5 className="font-mono text-xs uppercase tracking-wider text-stone-900 font-extrabold flex items-center gap-2">
                  <span>⚓ SECCIÓN 1: MANUAL DE TRÁNSITO DE MERCANCÍAS Y LOGÍSTICA PORTUARIA</span>
                </h5>
                <p className="text-stone-600">
                  La importación de perfiles y decks de WPC (Wood-Plastic Composite) a Colombia requiere una planificación rigurosa debido a la alta densidad de los materiales. Esta sección guía el procedimiento desde la fábrica de origen en régimen FOB hasta los principales puertos de destino colombianos.
                </p>
                
                <div className="bg-stone-50 p-3 rounded border border-stone-200 space-y-2.5 font-sans">
                  <h6 className="font-bold text-stone-800 text-[11px] uppercase tracking-tight">Pasos Clave de Tránsito Aduanero:</h6>
                  <ol className="list-decimal pl-4 space-y-1.5 text-stone-600 text-[11px]">
                    <li>
                      <strong>Clasificación Arancelaria (HS Code):</strong> Los perfiles de WPC para exteriores generalmente tributan bajo la subpartida <strong>3918.90.00.00</strong> (Revestimientos de plástico para suelos, paredes o techos) o <strong>3925.95.00.00</strong> (Elementos para la construcción de plástico) dependiendo del contenido volumétrico de PVC/polietileno frente a la fibra de madera.
                    </li>
                    <li>
                      <strong>Elección del Puerto de Destino en Colombia:</strong>
                      <ul className="list-disc pl-4 mt-1 space-y-1">
                        <li><strong>Puerto de Buenaventura (Pacífico):</strong> Recomendado para importaciones provenientes de Asia. Reduce tiempos de tránsito marítimo de 35 a 24 días. Es ideal para distribución en el Valle del Cauca, el Eje Cafetero y Bogotá (vía Alto de la Línea).</li>
                        <li><strong>Puerto de Cartagena (Atlántico):</strong> Recomendado para despachos desde Europa o la Costa Este de EE. UU. Destaca por su alta eficiencia aduanera, menor índice de inspecciones físicas invasivas y excelente conectividad terrestre con la Costa Norte (Barranquilla, Santa Marta) y Antioquia (Medellín vía Autopistas de la Prosperidad).</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Cálculo de Carga y Cubicaje (FOB Weight Limit):</strong> Las normas viales colombianas limitan rígidamente el peso bruto de vehículos de transporte terrestre (configuraciones de tractomulas de tres ejes C3-S3 admiten hasta 52 toneladas de peso bruto vehicular combinado).
                    </li>
                  </ol>

                  <div className="bg-white p-3 rounded border border-stone-150 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-[#c9a961] block">EJEMPLO PRÁCTICO DE CUBICAJE DE EMBARQUE WPC:</span>
                    <p className="text-[11px] text-stone-600">
                      Un contenedor estándar de 20 pies (20ft GP) tiene un límite de carga útil aduanera de <strong>21,500 kg (21.5 Toneladas)</strong> netas para tránsito terrestre en Colombia sin incurrir en sobrepeso aduanero de la DIAN.
                    </p>
                    <div className="font-mono text-[10.5px] text-stone-800 bg-stone-50 p-2 rounded border border-stone-100 space-y-1">
                      <div>• Peso de un panel de Deck Alveolar WPC (2.9m largo x 14cm ancho x 22mm espesor) = <strong>5.2 kg / pieza</strong></div>
                      <div>• Cantidad máxima permitida por contenedor = 21,500 kg / 5.2 kg = <strong>4,134 piezas de deck</strong></div>
                      <div>• Cubicaje volumétrico: 4,134 piezas ocupan aproximadamente 25.5 m³, lo que encaja perfectamente en el volumen útil de un contenedor de 20ft (33 m³).</div>
                      <div>• <em>Nota:</em> Nunca intente llenar un contenedor de 40ft High Cube al 100% de su volumen con WPC, ya que sobrepasará el límite de peso de tránsito terrestre colombiano mucho antes de llenar el volumen del contenedor.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección 2: Uso automatizado de Runway Gen-3 */}
              <div className="border-l-2 border-stone-900 pl-4 space-y-2">
                <h5 className="font-mono text-xs uppercase tracking-wider text-stone-900 font-extrabold flex items-center gap-2">
                  <span>🎬 SECCIÓN 2: PROCESAMIENTO AUTOMÁTICO DE VIDEO CON RUNWAY GEN-3</span>
                </h5>
                <p className="text-stone-600">
                  La plataforma cuenta con un integrador en tiempo real con la API oficial de RunwayML (versión 4.10.0) para sintetizar renders de video hiperrealistas de arquitectura en 3D y aplicaciones del WPC basados en el calendario técnico mensual.
                </p>

                <div className="bg-stone-50 p-3 rounded border border-stone-200 space-y-2.5 font-sans">
                  <h6 className="font-bold text-stone-800 text-[11px] uppercase tracking-tight">Instrucciones de Operación de la Suite Creativa:</h6>
                  <ol className="list-decimal pl-4 space-y-1.5 text-stone-600 text-[11px]">
                    <li>
                      <strong>Verificación del Token de Acceso:</strong> Asegúrese de registrar su clave secreta en la casilla de configuración. El backend del sistema procesa las solicitudes a través de un proxy local seguro (puerto 3000), ocultando su clave secreta del navegador web para evitar robos de consumo.
                    </li>
                    <li>
                      <strong>Diseño Automatizado del Prompt de Renderizado:</strong> El generador de video lee el nicho arquitectónico del día seleccionado (ej. Sostenibilidad, Decks de Lujo, Instalaciones Comerciales) y redacta automáticamente una instrucción altamente cinematográfica.
                    </li>
                    <li>
                      <strong>Monitoreo y Cola de Render:</strong> Al hacer clic en <strong className="text-stone-900">"Submit Runway Gen-3 Render"</strong>, la app establece comunicación segura con Runway, genera un ID de tarea único en la nube y activa una barra de progreso que consulta el estado del servidor cada 5 segundos.
                    </li>
                  </ol>

                  <div className="bg-white p-3 rounded border border-stone-150 space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-[#c9a961] block">EJEMPLO DE PROMPT CONSTRUIDO POR LA IA:</span>
                    <p className="text-[11px] text-stone-600">
                      Cuando el calendario selecciona el tema de <em>"Sostenibilidad y Resistencia Subtropical"</em>, el sistema concatena descriptores volumétricos estéticos optimizados para el modelo de Runway Gen-3:
                    </p>
                    <div className="font-mono text-[10.5px] text-stone-800 bg-stone-50 p-2 rounded border border-stone-100 italic">
                      "Cinematic architectural visualization of a luxury coastal villa in Cartagena, Colombia. Seamless co-extruded teak wood-plastic composite (WPC) cladding installed on external walls. Soft golden hour sunshine, photorealistic details, high-end materials, slow panning camera shot, 4k, architectural render style."
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección 3: Compliance y Regulación Técnica del Compuesto */}
              <div className="border-l-2 border-emerald-600 pl-4 space-y-2">
                <h5 className="font-mono text-xs uppercase tracking-wider text-stone-900 font-extrabold flex items-center gap-2">
                  <span>🛡️ SECCIÓN 3: MANUAL DE COMPLIANCE ADUANERO Y NORMAS TÉCNICAS</span>
                </h5>
                <p className="text-stone-600">
                  Todo el contenido promocional generado automáticamente por la inteligencia artificial pasa por un analizador de cumplimiento normativo (Compliance Auditor) para evitar publicidad engañosa o infracciones de normas técnicas colombianas.
                </p>

                <div className="bg-stone-50 p-3 rounded border border-stone-200 space-y-2 font-sans text-[11px] text-stone-600">
                  <p>
                    En Colombia, las aseveraciones sobre materiales de construcción compuestos están vigiladas por la Superintendencia de Industria y Comercio (SIC) y el Reglamento Colombiano de Construcción Sismo Resistente (NSR-10).
                  </p>
                  
                  <div className="bg-white p-2.5 rounded border border-stone-150 space-y-1.5">
                    <div className="font-bold text-stone-800 text-[10.5px] uppercase tracking-wider text-amber-600 flex items-center gap-1">
                      ⚠️ EJEMPLO DE CORRECCIÓN DE CUMPLIMIENTO REGULATORIO:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10.5px]">
                      <div className="p-2 bg-red-50 text-red-800 rounded border border-red-100">
                        <span className="font-bold block uppercase text-[8px] tracking-wide text-red-500">❌ Frase Prohibida (Publicidad Engañosa):</span>
                        "Nuestros revestimientos de deck WPC son 100% inmunes al fuego y resisten cualquier incendio forestal sin quemarse."
                      </div>
                      <div className="p-2 bg-emerald-50 text-emerald-800 rounded border border-emerald-100">
                        <span className="font-bold block uppercase text-[8px] tracking-wide text-emerald-500">✅ Alternativa Técnica de Cumplimiento:</span>
                        "Nuestros perfiles de WPC cuentan con aditivos retardantes de llama clasificados con certificación internacional ASTM Clase-B."
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección 4: Guía de Google Analytics (GA4) */}
              <div className="border-l-2 border-stone-500 pl-4 space-y-2">
                <h5 className="font-mono text-xs uppercase tracking-wider text-stone-900 font-extrabold flex items-center gap-2">
                  <span>📊 SECCIÓN 4: PROTOCOLO DE CONEXIÓN DE GOOGLE ANALYTICS (GA4)</span>
                </h5>
                <p className="text-stone-600">
                  La medición de conversiones es vital para justificar la inversión publicitaria. Siga estos pasos para conectar la cuenta corporativa de analítica:
                </p>

                <div className="bg-stone-50 p-3 rounded border border-stone-200 space-y-2 font-sans text-[11px] text-stone-600">
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Extraiga su ID de medición desde la consola de Google Analytics (generalmente con formato <code className="bg-stone-200 px-1 rounded font-mono">G-XXXXXXXXXX</code>).</li>
                    <li>Ingrese el ID en la pestaña <strong className="text-stone-900">"2. Google Analytics & KPIs"</strong> de este centro de control.</li>
                    <li>
                      <strong>Eventos Clave Registrados:</strong> El sistema rastreará de forma automática el evento <code className="bg-stone-200 px-1 rounded font-mono">catalog_pdf_download</code> (un cliente potencial descarga el catálogo de precios mayorista) y <code className="bg-stone-200 px-1 rounded font-mono">sample_box_request</code> (un arquitecto solicita una caja física de muestras de texturas de WPC para validar el tacto y color del producto).
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
