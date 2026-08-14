/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { X, CheckCircle, RotateCcw, Calendar, Copy, Globe, Keyboard, Printer, FileText, Settings, Play, Database } from 'lucide-react';

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'EN' | 'ES';
}

export default function HowToUseModal({ isOpen, onClose, language = 'ES' }: HowToUseModalProps) {
  const [modalLang, setModalLang] = useState<'EN' | 'ES'>('ES');

  // Synchronize with external language changes but let users toggle manually inside
  useEffect(() => {
    if (language) {
      setModalLang(language);
    }
  }, [language]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div id="how-to-use-modal" className="w-full max-w-3xl bg-[#f5f5f0] text-[#1a1a1a] border border-[#e5e5df] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scaleIn">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-[#e5e5df] bg-white gap-4">
          <div>
            <h3 className="text-lg font-sans font-black text-[#1a1a1a] tracking-tight uppercase flex items-center gap-2">
              <span className="text-[#c9a961]">UNITEC USA Design</span>
              <span className="text-stone-300">•</span>
              <span>Manual de Operación</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1 uppercase tracking-wider font-mono font-bold">
              Workflow Guide & Instructions per Function • Centro de Comando de Contenido
            </p>
          </div>
          
          {/* Inline Language Toggle inside Manual */}
          <div className="flex items-center gap-1.5 bg-[#f5f5f0] p-1 rounded-lg border border-[#e5e5df]">
            <button
              onClick={() => setModalLang('ES')}
              className={`px-3 py-1 text-xs font-sans font-bold rounded-md transition-all cursor-pointer ${
                modalLang === 'ES' 
                  ? 'bg-[#1a1a1a] text-[#c9a961] shadow-sm' 
                  : 'text-stone-500 hover:text-stone-850'
              }`}
            >
              🇨🇴 Español Colombiano
            </button>
            <button
              onClick={() => setModalLang('EN')}
              className={`px-3 py-1 text-xs font-sans font-bold rounded-md transition-all cursor-pointer ${
                modalLang === 'EN' 
                  ? 'bg-[#1a1a1a] text-[#c9a961] shadow-sm' 
                  : 'text-stone-500 hover:text-stone-850'
              }`}
            >
              🇺🇸 English
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-8 bg-[#f5f5f0]">
          
          {modalLang === 'ES' ? (
            // ================= SPANISH COLOMBIAN INSTRUCTIONS =================
            <div className="space-y-6 animate-fadeIn text-stone-750">
              <div className="bg-[#2d5a4a]/10 border border-[#2d5a4a]/20 p-4 rounded-xl text-[#2d5a4a] text-xs font-medium leading-relaxed">
                <strong>Guía de Uso & Flujo de Trabajo UNITEC USA:</strong> Esta plataforma organiza la creación y distribución de contenido bilingüe (Español/Inglés) en 3 pasos secuenciales orientados al sector comercial de revestimientos WPC, papel tapiz y acabados arquitectónicos en Colombia (Cartagena/Buenaventura) y Estados Unidos.
              </div>

              {/* Módulo 1: PASO 1 - Configuración & Estrategia */}
              <div className="flex gap-4 p-3.5 bg-white rounded-xl border border-stone-200 shadow-sm">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961] text-stone-950 font-mono text-xs font-black shadow-sm">
                  1
                </div>
                <div className="space-y-1.5 w-full">
                  <h4 className="font-extrabold text-[#1a1a1a] text-sm uppercase tracking-tight flex items-center justify-between">
                    <span>PASO 1: Configuración & Estrategia Inicial</span>
                    <span className="text-[#c9a961] font-mono text-[10px] bg-[#c9a961]/10 px-2 py-0.5 rounded border border-[#c9a961]/30">Suite Creativa</span>
                  </h4>
                  <p className="text-stone-650 text-xs leading-relaxed">
                    Acceda al panel de la <strong>Suite Creativa Avanzada</strong> en la parte superior para definir los pilares del proyecto:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
                    <li><strong className="text-[#1a1a1a]">1. Secuenciador de Temas (Theme Sequencer):</strong> Configure la estrategia temática para los 12 meses. Al hacer clic en <em>"Auto-Generate 12 Months"</em>, el sistema crea automáticamente temas bilingües estacionales (Cladding WPC, Papel Tapiz, normativas e importación).</li>
                    <li><strong className="text-[#1a1a1a]">2. Creador Unificado de Posts (Unified Post Creator):</strong> Redacte publicaciones completas para Instagram, LinkedIn, Facebook y YouTube con hashtags optimizados y prompts visuales estandarizados.</li>
                    <li><strong className="text-[#1a1a1a]">3. UNITEC STUDIO:</strong> Genere videos comerciales hiperrealistas y prompts cinematográficos para redes sociales y showrooms con tecnología Google Veo y Gemini AI.</li>
                    <li><strong className="text-[#1a1a1a]">4. Marca & Datos (Training Analytics Hub):</strong> Ajuste las directrices de marca, requisitos normativos (ASTM Clase-B, NSR-10) y métricas de rendimiento.</li>
                  </ul>
                </div>
              </div>

              {/* Módulo 2: PASO 2 - Planificación de Calendario */}
              <div className="flex gap-4 p-3.5 bg-white rounded-xl border border-stone-200 shadow-sm">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961] text-stone-950 font-mono text-xs font-black shadow-sm">
                  2
                </div>
                <div className="space-y-1.5 w-full">
                  <h4 className="font-extrabold text-[#1a1a1a] text-sm uppercase tracking-tight flex items-center justify-between">
                    <span>PASO 2: Planificación en Calendario de 12 Meses</span>
                    <span className="text-[#c9a961] font-mono text-[10px] bg-[#c9a961]/10 px-2 py-0.5 rounded border border-[#c9a961]/30">VisualCalendar</span>
                  </h4>
                  <p className="text-stone-650 text-xs leading-relaxed">
                    Estructure la distribución temporal del año con control bilingüe e indicadores en tiempo real:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
                    <li><strong className="text-[#1a1a1a]">Generación en Lote por Mes:</strong> Seleccione cualquier mes en el carrusel y presione <em>"Generar Mes Completo en Lote"</em> para estructurar los 30 días de forma automatizada.</li>
                    <li><strong className="text-[#1a1a1a]">Festivos de Colombia & Aduanas:</strong> Active la integración de festivos para detectar automáticamente días no laborales en Colombia que puedan impactar la logística en puertos de Cartagena o Buenaventura.</li>
                    <li><strong className="text-[#1a1a1a]">Atajos de Teclado:</strong> Navegue velozmente usando las flechas ⬅️ ➡️ para cambiar de mes y ⬆️ ⬇️ para avanzar secuencialmente entre días.</li>
                  </ul>
                </div>
              </div>

              {/* Módulo 3: PASO 3 - Generación de Contenido, Revisión y Exportación */}
              <div className="flex gap-4 p-3.5 bg-white rounded-xl border border-stone-200 shadow-sm">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#2d5a4a] text-white font-mono text-xs font-black shadow-sm">
                  3
                </div>
                <div className="space-y-1.5 w-full">
                  <h4 className="font-extrabold text-[#1a1a1a] text-sm uppercase tracking-tight flex items-center justify-between">
                    <span>PASO 3: Revisión Diaria, Aprobación & Exportación</span>
                    <span className="text-[#2d5a4a] font-mono text-[10px] bg-[#2d5a4a]/10 px-2 py-0.5 rounded border border-[#2d5a4a]/30">DailyContentPreview</span>
                  </h4>
                  <p className="text-stone-650 text-xs leading-relaxed">
                    Finalice el trabajo de creación revisando y exportando las publicaciones aprobadas:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
                    <li><strong className="text-[#1a1a1a]">Generador de Contenido Diario:</strong> Seleccione cualquier día y presione <em>"Generar Contenido de Hoy"</em> para compilar copys bilingües adaptados a cada red social.</li>
                    <li><strong className="text-[#1a1a1a]">Control de Tono de Voz:</strong> Alterne dinámicamente entre ROI Comercial WPC, Ficha Técnica ASTM y Enfoque en Constructores Locales.</li>
                    <li><strong className="text-[#1a1a1a]">Semáforo de Estado:</strong> Cambie el estado de Pendiente (Gris) a Generado (Dorado) o Aprobado (Verde) para coordinar con el equipo de marketing.</li>
                    <li><strong className="text-[#1a1a1a]">Exportación & Impresión:</strong> Descargue reportes en CSV o JSON, o imprima el <em>Brief Diario</em> en PDF con formato A4/Oficio listo para juntas ejecutivas.</li>
                  </ul>
                </div>
              </div>

              {/* Info de Respaldo */}
              <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 text-stone-600 text-xs flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-stone-800">💾 Respaldo Automático de Seguridad:</span>
                <span>Guardado local redundante cada 5 minutos. Visualice la hora exacta en la cabecera principal.</span>
              </div>
            </div>
          ) : (
            // ================= ENGLISH INSTRUCTIONS =================
            <div className="space-y-8 animate-fadeIn text-stone-750">
              <div className="bg-[#2d5a4a]/10 border border-[#2d5a4a]/20 p-4 rounded-xl text-[#2d5a4a] text-xs font-medium leading-relaxed">
                <strong>Welcome to the UNITEC USA Content Command Center Manual:</strong> This comprehensive technical guide details the operation of each module within the platform, designed to facilitate the wholesaling and marketing of premium double-extrusion co-extrusion WPC cladding across US and Colombian markets.
              </div>

              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/35 font-mono text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-sm uppercase tracking-tight flex items-center gap-2">
                    Define Annual Themes & Niches <span className="text-stone-500 font-normal">| ThemeControlPanel</span>
                  </h4>
                  <p className="mt-1.5 text-stone-650 text-xs leading-relaxed">
                    Located at the bottom of the main dashboard, this grid structures the overarching marketing themes for the 12 calendar months.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-stone-600">
                    <li><strong className="text-[#1a1a1a]">Bulk Sequence:</strong> The <em className="not-italic font-bold">"Auto-Generate 12 Months"</em> button deploys a pre-structured construction and architectural seasonality plan.</li>
                    <li><strong className="text-[#1a1a1a]">Manual Edit:</strong> Each theme cell can be edited manually. Real-time changes are synchronized directly to local caches.</li>
                    <li><strong className="text-[#1a1a1a]">Voice Input:</strong> Click the microphone icon next to any theme field to speak and dictate your seasonal headlines instantly.</li>
                  </ul>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/35 font-mono text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-sm uppercase tracking-tight flex items-center gap-2">
                    AI Content Copys Generator <span className="text-stone-500 font-normal">| DailyContentPreview</span>
                  </h4>
                  <p className="mt-1.5 text-stone-650 text-xs leading-relaxed">
                    The core engine to craft copy setups, hashtags, and visual prompts for social media platforms.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-stone-600">
                    <li><strong className="text-[#1a1a1a]">Single Generation:</strong> Select any empty block on the calendar, choose your target tone, and hit <em className="not-italic font-bold">"Generate Today's Content"</em> to compile social copies.</li>
                    <li><strong className="text-[#1a1a1a]">Tones of Voice:</strong> Dynamically switch between Wholesale ROI, Technical ASTM, or Local Builders to align copy outputs with target reader psychologies.</li>
                    <li><strong className="text-[#1a1a1a]">Time Schedulers:</strong> Automatically recommends high-interaction posting times. Feel free to override them using custom inputs.</li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/35 font-mono text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-sm uppercase tracking-tight flex items-center gap-2">
                    Compliance Checks & Double-Review <span className="text-stone-500 font-normal">| Regulations</span>
                  </h4>
                  <p className="mt-1.5 text-stone-650 text-xs leading-relaxed">
                    Ensures all social posts adhere to architectural and technical wholesaling guidelines, avoiding false structural or engineering statements.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-stone-600">
                    <li><strong className="text-[#1a1a1a]">ASTM Certification Guard:</strong> Ensures waterproof or polymer claims always cite valid ASTM standards (e.g. ASTM Class-B rating).</li>
                    <li><strong className="text-[#1a1a1a]">FOB Freight Terms:</strong> Flags freight content that does not explicitly declare FOB shipment conditions (Miami, Cartagena, Buenaventura).</li>
                    <li><strong className="text-[#1a1a1a]">Colombia Bank Closures:</strong> Automatically flags Colombian holidays, warning administrators that customs offices, ports, and logistic channels are inactive.</li>
                    <li><strong className="text-[#1a1a1a]">State Indicators:</strong> Uses a structured color scheme: Empty (Gray), Generated (Gold), Approved (Green), and Flagged with compliance alerts (Amber !).</li>
                  </ul>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/35 font-mono text-sm font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-sm uppercase tracking-tight flex items-center gap-2">
                    Keyboard Navigation Shortcuts <span className="text-stone-500 font-normal">| Speed Workflows</span>
                  </h4>
                  <p className="mt-1.5 text-stone-650 text-xs leading-relaxed">
                    Blazing-fast keyboard navigation to fly through scheduling days and months.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-stone-600 font-mono">
                    <li><strong className="text-[#1a1a1a]">Left / Right Arrows (⬅️ ➡️):</strong> Instantly navigate back and forth between consecutive calendar months.</li>
                    <li><strong className="text-[#1a1a1a]">Up / Down Arrows (⬆️ ⬇️):</strong> Seamlessly select consecutive calendar days. When crossing month boundaries, the scheduler automatically transitions to the adjoining month.</li>
                  </ul>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/35 font-mono text-sm font-bold">
                  5
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-sm uppercase tracking-tight flex items-center gap-2">
                    Professional Printing & PDF Exports <span className="text-stone-500 font-normal">| Reporting Hub</span>
                  </h4>
                  <p className="mt-1.5 text-stone-650 text-xs leading-relaxed">
                    Generate high-fidelity, clean documents optimized for physical hand-outs or digital board sharing.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-stone-600">
                    <li><strong className="text-[#1a1a1a]">Print Daily Brief:</strong> Renders a beautifully isolated document detailing the copy, hashtags, scheduling, and image prompt for the selected day.</li>
                    <li><strong className="text-[#1a1a1a]">Print Monthly Report:</strong> Available to print the entire month's operational overview in a tabular summary.</li>
                    <li><strong className="text-[#1a1a1a]">Save as PDF:</strong> Simply open the print panel via the buttons and select <em className="not-italic font-bold">"Save as PDF"</em> as your printer destination. Enable "Background graphics" in print settings for color representation.</li>
                  </ul>
                </div>
              </div>

              {/* Step 6 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/35 font-mono text-sm font-bold">
                  6
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-sm uppercase tracking-tight flex items-center gap-2">
                    Local Autosave Backup System <span className="text-stone-500 font-normal">| Persistent Storage</span>
                  </h4>
                  <p className="mt-1.5 text-stone-650 text-xs leading-relaxed">
                    Your scheduling efforts are safe from sudden browser reloads or power losses.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-stone-600">
                    <li><strong className="text-[#1a1a1a]">5-Minute Autosave:</strong> Every 5 minutes, the app saves all 12 calendar months, custom descriptions, and brand training rules to LocalStorage.</li>
                    <li><strong className="text-[#1a1a1a]">Saved Timestamp:</strong> Check the header bar to see a real-time timestamp of the last successful backup (<em className="not-italic text-[#c9a961] font-mono">LAST SAVED: HH:MM</em>).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-[#1a1a1a] p-6 border-t border-[#e5e5df] flex justify-end">
          <button
            id="acknowledge-manual-btn"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#c9a961] hover:bg-[#b09352] text-stone-950 font-sans font-bold text-xs tracking-wider rounded transition-colors uppercase cursor-pointer"
          >
            {modalLang === 'ES' ? 'Entendido • Cerrar Manual' : 'Acknowledge Manual • Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
