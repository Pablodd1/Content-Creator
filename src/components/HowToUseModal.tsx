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
            <div className="space-y-8 animate-fadeIn text-stone-750">
              <div className="bg-[#2d5a4a]/10 border border-[#2d5a4a]/20 p-4 rounded-xl text-[#2d5a4a] text-xs font-medium leading-relaxed">
                <strong>Bienvenido al Centro de Comando de Contenido UNITEC USA:</strong> Este manual detalla minuciosamente el funcionamiento técnico y operacional de cada módulo de la plataforma, diseñado específicamente para la distribución mayorista de revestimientos de WPC (revestimientos de coextrusión bicapa) en Colombia (puertos de Cartagena/Buenaventura) y Estados Unidos.
              </div>

              {/* Módulo 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/35 font-mono text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-sm uppercase tracking-tight flex items-center gap-2">
                    Definición de Temas Anuales <span className="text-stone-500 font-normal">| ThemeControlPanel</span>
                  </h4>
                  <p className="mt-1.5 text-stone-650 text-xs leading-relaxed">
                    Ubicado en la parte inferior del tablero principal. Este panel permite estructurar la agenda estratégica de marketing para los 12 meses del año.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-stone-600">
                    <li><strong className="text-[#1a1a1a]">Generación en Lote:</strong> El botón <em className="not-italic font-bold">"Auto-Generate 12 Months"</em> crea de forma inteligente un plan estacional unificado donde se asocian de inmediato temas y nichos arquitectónicos optimizados.</li>
                    <li><strong className="text-[#1a1a1a]">Modificación Manual Directa:</strong> Cada celda de tema (bilingüe Inglés/Español) es editable en tiempo real. Al cambiar el texto, la memoria caché local se actualiza automáticamente.</li>
                    <li><strong className="text-[#1a1a1a]">Asignación de Nichos:</strong> Permite sincronizar cada mes con audiencias técnicas clave como arquitectos, constructoras o mayoristas.</li>
                    <li><strong className="text-[#1a1a1a]">Entrada de Voz:</strong> Presione el ícono de micrófono junto a los inputs para dictar el título del tema directamente mediante reconocimiento de voz.</li>
                  </ul>
                </div>
              </div>

              {/* Módulo 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/35 font-mono text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-sm uppercase tracking-tight flex items-center gap-2">
                    Generador de Contenido Bilingüe e Inteligente <span className="text-stone-500 font-normal">| DailyContentPreview</span>
                  </h4>
                  <p className="mt-1.5 text-stone-650 text-xs leading-relaxed">
                    Es el motor neuronal del sistema. Genera los copys específicos para cada red social utilizando IA de vanguardia.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-stone-600">
                    <li><strong className="text-[#1a1a1a]">Generación Individual:</strong> Al seleccionar cualquier día libre, puede elegir el tono deseado (ROI Comercial, Ficha Técnica, Constructor Local) y pulsar <em className="not-italic font-bold">"Generar Contenido de Hoy"</em> para ensamblar los copys y prompts del día.</li>
                    <li><strong className="text-[#1a1a1a]">Tono de Voz:</strong> Cambie dinámicamente entre acentos de venta directa, divulgación de resistencia técnica (normativa ASTM), o historias de éxito locales en Colombia para modelar el copy generado.</li>
                    <li><strong className="text-[#1a1a1a]">Edición Directa de Horarios:</strong> El planificador calcula automáticamente las horas de mayor interacción. Puede modificarlas manualmente usando los selectores integrados por red social.</li>
                  </ul>
                </div>
              </div>

              {/* Módulo 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/35 font-mono text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-sm uppercase tracking-tight flex items-center gap-2">
                    Sistema de Cumplimiento Normativo y Doble Revisión <span className="text-stone-500 font-normal">| Compliance Center</span>
                  </h4>
                  <p className="mt-1.5 text-stone-650 text-xs leading-relaxed">
                    Garantiza que el contenido respete los estrictos estándares industriales de UNITEC y no incurra en falsas promesas o riesgos legales.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-stone-600">
                    <li><strong className="text-[#1a1a1a]">Control ASTM Clase-B:</strong> Valida que al proclamar impermeabilidad o retardancia de llama, se listen certificaciones ASTM oficiales.</li>
                    <li><strong className="text-[#1a1a1a]">Términos de Envío FOB:</strong> Audita que las publicaciones comerciales de logística mencionen específicamente las condiciones de envío FOB (Cartagena, Buenaventura o Miami).</li>
                    <li><strong className="text-[#1a1a1a]">Festivos Nacionales en Colombia:</strong> El sistema advierte de forma automática si un día coincide con un festivo en Colombia, sugiriendo posponer o reconfigurar la publicación debido a cierres de aduanas y oficinas administrativas.</li>
                    <li><strong className="text-[#1a1a1a]">Semáforo de Estado:</strong> El color del día en el calendario indica si el post está Vacío (Gris), Generado esperando revisión (Dorado), Aprobado formalmente (Verde) o con Alertas pendientes de resolver (Naranja).</li>
                  </ul>
                </div>
              </div>

              {/* Módulo 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/35 font-mono text-sm font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-sm uppercase tracking-tight flex items-center gap-2">
                    Copiar y Desplegar en Múltiples Plataformas <span className="text-stone-500 font-normal">| Multi-Platform Copy</span>
                  </h4>
                  <p className="mt-1.5 text-stone-650 text-xs leading-relaxed">
                    Proporciona pestañas dedicadas para Instagram, LinkedIn, Facebook, y YouTube, organizando los copys listos para publicar.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-stone-600">
                    <li><strong className="text-[#1a1a1a]">Copiado Inteligente:</strong> Copie el contenido de una red social individual con un solo clic, o presione <em className="not-italic font-bold">"Copiar Todo el Contenido"</em> para capturar el plan unificado de todas las plataformas, hashtags y prompts de imagen del día.</li>
                    <li><strong className="text-[#1a1a1a]">Visuales Prompts:</strong> Incluye un prompt de inteligencia artificial en formato estandarizado (Midjourney/Flux) para generar imágenes fotorrealistas de revestimientos WPC en proyectos de lujo.</li>
                  </ul>
                </div>
              </div>

              {/* Módulo 5 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/35 font-mono text-sm font-bold">
                  5
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-sm uppercase tracking-tight flex items-center gap-2">
                    Atajos de Teclado Globales <span className="text-stone-500 font-normal">| Keyboard Shortcuts</span>
                  </h4>
                  <p className="mt-1.5 text-stone-650 text-xs leading-relaxed">
                    Navegue a la velocidad del pensamiento. Diseñado especialmente para agilizar el flujo de trabajo de los administradores.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-stone-600 font-mono">
                    <li><strong className="text-[#1a1a1a]">Flecha Izquierda / Derecha (⬅️ ➡️):</strong> Cambia de forma instantánea entre los meses del año para revisar el cronograma estacional.</li>
                    <li><strong className="text-[#1a1a1a]">Flecha Arriba / Abajo (⬆️ ⬇️):</strong> Navega y selecciona secuencialmente los días del mes actual. Al cruzar los límites del mes, avanza o retrocede automáticamente de mes seleccionando el día correspondiente.</li>
                  </ul>
                </div>
              </div>

              {/* Módulo 6 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/35 font-mono text-sm font-bold">
                  6
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-sm uppercase tracking-tight flex items-center gap-2">
                    Reportes de Impresión Profesional y Generación de PDF <span className="text-stone-500 font-normal">| Reporting & PDF Exports</span>
                  </h4>
                  <p className="mt-1.5 text-stone-650 text-xs leading-relaxed">
                    Usted puede exportar reportes de impresión de alta fidelidad, diseñados con hojas de estilo dedicadas para tamaño A4 u oficios.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-stone-600">
                    <li><strong className="text-[#1a1a1a]">Imprimir Brief Diario:</strong> Disponible en la cabecera del visor de contenido del día. Formatea exclusivamente la información, copys, hashtags y directivas visuales de ese día, ocultando la interfaz de la aplicación.</li>
                    <li><strong className="text-[#1a1a1a]">Imprimir Reporte Mensual Completo:</strong> Próximamente disponible de manera unificada. Genera un cronograma completo del mes seleccionado en forma de tabla administrativa con fechas, estados de revisión, horas planeadas y ángulos de comunicación.</li>
                    <li><strong className="text-[#1a1a1a]">Exportar a PDF:</strong> Al abrirse la ventana nativa de impresión del navegador, simplemente seleccione como destino <em className="not-italic font-bold">"Guardar como PDF"</em> (Save as PDF). Asegúrese de activar la casilla "Imprimir gráficos de fondo" para plasmar perfectamente los acentos visuales y colores de los semáforos de cumplimiento.</li>
                  </ul>
                </div>
              </div>

              {/* Módulo 7 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/35 font-mono text-sm font-bold">
                  7
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-sm uppercase tracking-tight flex items-center gap-2">
                    Módulo de Video Asistido por IA <span className="text-stone-500 font-normal">| VideoGenerator</span>
                  </h4>
                  <p className="mt-1.5 text-stone-650 text-xs leading-relaxed">
                    Estructure y redacte guiones para videos de redes sociales de forma automatizada.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-stone-600">
                    <li><strong className="text-[#1a1a1a]">Guión Estructurado:</strong> Crea de forma automática guiones bilingües con indicaciones para el presentador, locución de voz y tomas de apoyo visual (B-Roll).</li>
                    <li><strong className="text-[#1a1a1a]">Plataformas de Render:</strong> Los prompts generados están formateados para ingresar directamente a herramientas de síntesis como HeyGen, InVideo o Runway.</li>
                  </ul>
                </div>
              </div>

              {/* Módulo 8 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/35 font-mono text-sm font-bold">
                  8
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-sm uppercase tracking-tight flex items-center gap-2">
                    Entrenamiento de Marca y Google Analytics Simulado <span className="text-stone-500 font-normal">| TrainingAnalyticsHub</span>
                  </h4>
                  <p className="mt-1.5 text-stone-650 text-xs leading-relaxed">
                    Alinee el comportamiento de la inteligencia artificial con el ADN exacto de la empresa.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-stone-600">
                    <li><strong className="text-[#1a1a1a]">Directrices Corporativas:</strong> Defina el nombre de la empresa, la propuesta de valor del WPC coextruido bicapa, guías de tono y palabras clave obligatorias. Al guardar, el motor de IA prioriza estas reglas en cada nueva generación.</li>
                    <li><strong className="text-[#1a1a1a]">Simulador de Rendimiento:</strong> Realice seguimiento del tráfico de marketing digital, tasa de clics (CTR) y tasas de conversión simuladas asociadas a las campañas del sistema.</li>
                  </ul>
                </div>
              </div>

              {/* Módulo 9 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/35 font-mono text-sm font-bold">
                  9
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-sm uppercase tracking-tight flex items-center gap-2">
                    Respaldo Automático de Seguridad <span className="text-stone-500 font-normal">| Local Autosave Backup</span>
                  </h4>
                  <p className="mt-1.5 text-stone-650 text-xs leading-relaxed">
                    Sus datos de trabajo están totalmente seguros gracias al sistema de copia de seguridad redundante integrado.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-stone-600">
                    <li><strong className="text-[#1a1a1a]">Respaldo Automático de 5 Minutos:</strong> Cada 5 minutos el sistema consolida el estado entero de la aplicación (12 meses de calendario, copys editados manualmente, configuraciones de marca) y los escribe en el almacenamiento seguro del navegador.</li>
                    <li><strong className="text-[#1a1a1a]">Sello de Guardado:</strong> Visualice de manera interactiva la hora exacta del último respaldo directamente en la cabecera principal junto al contador de telemetría (<em className="not-italic text-[#c9a961] font-mono">GUARDADO: HH:MM</em>).</li>
                  </ul>
                </div>
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
