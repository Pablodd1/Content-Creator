/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, CheckCircle, RotateCcw, Calendar, Copy } from 'lucide-react';

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowToUseModal({ isOpen, onClose }: HowToUseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div id="how-to-use-modal" className="w-full max-w-2xl bg-[#f5f5f0] text-[#1a1a1a] border border-[#e5e5df] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e5e5df] bg-white">
          <div>
            <h3 className="text-base font-sans font-bold text-[#1a1a1a] tracking-tight">
              UNITEC USA Design • Content Command Center Manual
            </h3>
            <p className="text-xs text-stone-500 mt-1 uppercase tracking-wider font-mono font-bold">
              Workflow Guide & Instructions • Manual de Procedimiento
            </p>
          </div>
          <button
            id="close-manual-btn"
            onClick={onClose}
            className="p-1 hover:bg-stone-200 rounded-full transition-colors text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-stone-700 text-sm leading-relaxed bg-[#f5f5f0]">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/35 font-mono text-sm font-bold">
              1
            </div>
            <div>
              <h4 className="font-bold text-[#1a1a1a] flex items-center gap-2">
                Configure Yearly Themes <span className="text-stone-500 font-normal">| Definir Temas Anuales</span>
              </h4>
              <p className="mt-1 font-medium text-stone-600">
                Use the <strong className="text-[#1a1a1a]">"Auto-Generate 12 Months"</strong> button to deploy a construction-synchronized seasonal plan. If you have custom marketing periods, click any cell on the theme grid to manually override theme names.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/35 font-mono text-sm font-bold">
              2
            </div>
            <div>
              <h4 className="font-bold text-[#1a1a1a] flex items-center gap-2">
                Generate Optimized Copy <span className="text-stone-500 font-normal">| Generación de Contenido</span>
              </h4>
              <p className="mt-1 font-medium text-stone-600">
                Select a month from the interactive calendar. Click <strong className="text-[#1a1a1a]">"Bulk Generate Month"</strong> to produce daily updates instantly, or select a single calendar block and trigger <strong className="text-[#1a1a1a]">"Generate Today's Content"</strong> to target a specific date.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/35 font-mono text-sm font-bold">
              3
            </div>
            <div>
              <h4 className="font-bold text-[#1a1a1a] flex items-center gap-2">
                Double-Review & Approval <span className="text-stone-500 font-normal">| Sistema de Revisión</span>
              </h4>
              <p className="mt-1 font-medium text-stone-600">
                Our internal compliance system checks each post:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-stone-550 font-medium">
                <li><strong className="text-[#c9a961]">Gold Dot:</strong> Content successfully generated, waiting to be reviewed.</li>
                <li><strong className="text-emerald-600">Green Check:</strong> Reviewed and approved for publishing.</li>
                <li><strong className="text-amber-600">Amber Flag (!)</strong>: Safety block (e.g. claim limits audited, emoji limit, LinkedIn branding).</li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/35 font-mono text-sm font-bold">
              4
            </div>
            <div>
              <h4 className="font-bold text-[#1a1a1a] flex items-center gap-2">
                Copy-Paste & Multi-Platform Deploy <span className="text-stone-500 font-normal">| Copy-Paste Dinámico</span>
              </h4>
              <p className="mt-1 font-medium text-stone-600">
                Each platform tab (Instagram, LinkedIn, Facebook, YouTube) highlights optimized copy setups. Use the individual copy triggers or click <strong className="text-[#1a1a1a]">"Copy All Platforms"</strong> to export everything. Ready-to-use Midjourney/Flux image descriptors let you create complementary visuals instantly.
              </p>
            </div>
          </div>
          
          {/* Step 5 - Navigation */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/35 font-mono text-sm font-bold">
              5
            </div>
            <div>
              <h4 className="font-bold text-[#1a1a1a] flex items-center gap-2">
                Keyboard Shortcuts <span className="text-stone-500 font-normal">| Navegación por Teclado</span>
              </h4>
              <p className="mt-1 font-medium text-stone-600">
                You can quickly navigate the scheduler using your keyboard:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-stone-550 font-medium">
                <li><strong className="text-[#1a1a1a]">Left/Right Arrows (⬅️ ➡️):</strong> Navigate between months instantly.</li>
                <li><strong className="text-[#1a1a1a]">Up/Down Arrows (⬆️ ⬇️):</strong> Select the previous or next day, seamlessly crossing month boundaries.</li>
              </ul>
            </div>
          </div>

          {/* Step 6 - Reports */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/35 font-mono text-sm font-bold">
              6
            </div>
            <div>
              <h4 className="font-bold text-[#1a1a1a] flex items-center gap-2">
                Printing & PDF Reports <span className="text-stone-500 font-normal">| Reportes PDF e Impresión</span>
              </h4>
              <p className="mt-1 font-medium text-stone-600">
                Export professional layout briefs for stakeholders. Use <strong className="text-[#1a1a1a]">"Print Daily Brief"</strong> for a single day's specific content layout and visual prompts, or <strong className="text-[#1a1a1a]">"Print Monthly Report"</strong> for a comprehensive overview of the active month. When the print dialog opens, you can choose to "Save as PDF" to generate a digital PDF copy of the reports.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#1a1a1a] p-6 border-t border-[#e5e5df] flex justify-end">
          <button
            id="acknowledge-manual-btn"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#c9a961] hover:bg-[#b09352] text-stone-950 font-sans font-bold text-xs tracking-wider rounded transition-colors uppercase cursor-pointer"
          >
            Acknowledge Manual • Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
