import React, { useState, useRef } from 'react';
import VideoGenerator from './components/VideoGenerator';
import {
  FileText,
  Video,
  Sparkles,
  MessageSquare,
  Image as ImageIcon,
  Calendar,
  Download,
  Bell,
  Hash,
  CheckCircle,
  Copy,
  Eye,
  Trash2,
  X,
  Plus,
  RefreshCw,
  FileCode,
  Layers
} from 'lucide-react';

export interface AttachedFile {
  id: string;
  name: string;
  sizeFormatted: string;
  type: 'image' | 'text' | 'document';
  mimeType: string;
  dataUrl?: string;
  textContent?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('context');
  const [selectedCampaign, setSelectedCampaign] = useState('Campaña Estratégica General');
  const [selectedTone, setSelectedTone] = useState<'Sales-driven' | 'Informational' | 'Community-centric'>('Sales-driven');
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');
  const [contextText, setContextText] = useState('');
  
  // Attached files state with full object details
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([
    {
      id: 'file-1',
      name: 'Ficha_Tecnica_Campana.pdf',
      sizeFormatted: '1.2 MB',
      type: 'document',
      mimeType: 'application/pdf',
      textContent: 'FICHA TÉCNICA Y ESPECIFICACIONES:\n- Producto: Revestimiento Arquitectónico Premium 8K\n- Propuesta de valor: 100% Impermeable, acústico y lavable\n- Público objetivo: Arquitectos, diseñadores de interiores y desarrolladores residenciales en Miami y Latinoamérica.'
    },
    {
      id: 'file-2',
      name: 'Referencia_Visual_Producto.jpg',
      sizeFormatted: '850 KB',
      type: 'image',
      mimeType: 'image/jpeg',
      dataUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'file-3',
      name: 'Guion_Estrategico_Brief.docx',
      sizeFormatted: '45 KB',
      type: 'text',
      mimeType: 'text/plain',
      textContent: 'BRIEF DE MARKETING:\nObjetivo principal: Posicionar la marca como líder en innovación y acabados de lujo.\nMensaje clave: "Eleva tus espacios con texturas tridimensionales y elegancia atemporal".'
    }
  ]);

  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [generatedImg, setGeneratedImg] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600');
  const [previewFile, setPreviewFile] = useState<AttachedFile | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Helper to format file sizes
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Handle document/file uploads from local computer
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const isText = file.type.startsWith('text/') || 
                     file.name.endsWith('.txt') || 
                     file.name.endsWith('.md') || 
                     file.name.endsWith('.csv') || 
                     file.name.endsWith('.json');

      const isImg = file.type.startsWith('image/');

      if (isImg) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          const newFile: AttachedFile = {
            id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            name: file.name,
            sizeFormatted: formatFileSize(file.size),
            type: 'image',
            mimeType: file.type || 'image/png',
            dataUrl
          };
          setAttachedFiles(prev => [...prev, newFile]);
        };
        reader.readAsDataURL(file);
      } else if (isText) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const textContent = event.target?.result as string;
          const newFile: AttachedFile = {
            id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            name: file.name,
            sizeFormatted: formatFileSize(file.size),
            type: 'text',
            mimeType: file.type || 'text/plain',
            textContent
          };
          setAttachedFiles(prev => [...prev, newFile]);
          
          // Optionally append to textarea
          setContextText(prev => prev + (prev ? '\n\n' : '') + `--- Contenido de ${file.name} ---\n` + textContent);
        };
        reader.readAsText(file);
      } else {
        // Non-text documents (PDF, DOCX)
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          const newFile: AttachedFile = {
            id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            name: file.name,
            sizeFormatted: formatFileSize(file.size),
            type: 'document',
            mimeType: file.type || 'application/octet-stream',
            dataUrl,
            textContent: `Documento adjunto: ${file.name} (${formatFileSize(file.size)})`
          };
          setAttachedFiles(prev => [...prev, newFile]);
        };
        reader.readAsDataURL(file);
      }
    });

    // Reset input
    if (e.target) e.target.value = '';
  };

  // Handle image specific upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e);
  };

  // Remove attached file
  const handleRemoveFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Trigger Gemini Multimodal Post Generation
  const handleGenerateContent = async () => {
    setIsGenerating(true);
    try {
      // Gather document text contents
      const documentTexts = attachedFiles
        .filter(f => f.textContent && f.textContent.trim().length > 0)
        .map(f => `📄 [Archivo: ${f.name}]\n${f.textContent}`);

      // Gather image base64 strings
      const images = attachedFiles
        .filter(f => f.type === 'image' && f.dataUrl && f.dataUrl.startsWith('data:image/'))
        .map(f => f.dataUrl as string);

      const res = await fetch('/api/generate-universal-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          want: contextText,
          language: 'ES',
          title: selectedCampaign,
          target: "Clientes potenciales y audiencia objetivo",
          objective: "Generar compromiso, visibilidad y conversiones de alto impacto",
          tone: selectedTone,
          platform: selectedPlatform,
          documentTexts,
          images
        })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedText(data.text);
        setActiveTab('copies');
      } else {
        alert(data.error || 'Error al generar el contenido.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al generar el contenido.');
    }
    setIsGenerating(false);
  };

  // Download individual document representation
  const handleDownloadDoc = (file: AttachedFile) => {
    let content = `================================================
DOCUMENTO DE CONTEXTO Y REFERENCIA
================================================
Nombre del archivo: ${file.name}
Tipo: ${file.type} (${file.mimeType})
Tamaño: ${file.sizeFormatted}
Campaña activa: ${selectedCampaign}
Fecha de registro: ${new Date().toLocaleDateString('es-ES')}

DESCRIPCIÓN Y CONTENIDO REGISTRADO:
${file.textContent || 'Archivo de referencia adjunto para análisis de campaña de marketing.'}

================================================
CONTENT IA - PLATAFORMA ESTRATÉGICA DE MARKETING
================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.includes('.') ? file.name : `${file.name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download context summary report
  const handleDownloadContextSummary = () => {
    const summaryText = `================================================
RESUMEN EJECUTIVO DE CONTEXTUALIZACIÓN Y BRIEFING
================================================
Fecha de generación: ${new Date().toLocaleDateString('es-ES')}
Campaña seleccionada: ${selectedCampaign}
Tono de voz: ${selectedTone}
Plataforma objetivo: ${selectedPlatform}

1. ARCHIVOS Y DOCUMENTOS ADJUNTOS EN CONTEXTO (${attachedFiles.length}):
${attachedFiles.map((f, i) => `   ${i + 1}. [${f.type.toUpperCase()}] ${f.name} (${f.sizeFormatted})`).join('\n')}

2. INSTRUCCIONES Y DETALLES DE CAMPAÑA:
${contextText.trim() ? contextText : 'Campaña estratégica enfocada en maximizar la visibilidad, la interacción orgánica y las conversiones del producto o servicio.'}

3. CONTENIDO EXTRAÍDO DE DOCUMENTOS:
${attachedFiles.filter(f => f.textContent).map(f => `--- ${f.name} ---\n${f.textContent}`).join('\n\n')}

================================================
CONTENT IA - SISTEMA DE MARKETING Y GENERACIÓN
================================================`;

    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Resumen_Contextualizacion_Contenido.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download complete content generation summary report
  const handleDownloadContentSummary = () => {
    const reportText = `================================================
REPORTE GENERAL DE GENERACIÓN DE CONTENIDO Y MARKETING
================================================
Fecha de emisión: ${new Date().toLocaleDateString('es-ES')}
Campaña: ${selectedCampaign}
Tono de Voz: ${selectedTone}
Plataforma: ${selectedPlatform}

------------------------------------------------
1. RESUMEN DEL CONTEXTO Y BRIEFING
------------------------------------------------
Archivos de contexto (${attachedFiles.length}): ${attachedFiles.map(f => f.name).join(', ')}
Indicaciones clave: "${contextText || 'Generación de contenido de alto impacto para campañas digitales.'}"

------------------------------------------------
2. COPY GENERADO PARA REDES SOCIALES
------------------------------------------------
${generatedText || `✨ ¡Lleva tu marca al siguiente nivel con contenido estratégico! 🚀

Publicaciones optimizadas para conectar con tu audiencia objetivo, transmitir una propuesta de valor clara y acelerar tus resultados. ✨

#MarketingDigital #EstrategiaDigital #Lanzamiento #Posicionamiento #Campaña2026`}

------------------------------------------------
3. PALABRAS CLAVE Y HASHTAGS
------------------------------------------------
#MarketingDigital #EstrategiaDigital #ContenidoIA #Publicidad #RedesSociales #GrowthMarketing #Innovacion

------------------------------------------------
4. RECURSO VISUAL Y PROMPTS
------------------------------------------------
Miniatura / Titular: "¿LISTO PARA TRANSFORMAR TUS RESULTADOS?"
Descripción visual: Escena profesional con iluminación de estudio softbox, estética fotorrealista y alta definición en 8K.

------------------------------------------------
5. CRONOGRAMA DE PUBLICACIÓN EN CALENDARIO
------------------------------------------------
- Instagram: 23 Mayo 2026 - 10:00 AM
- Facebook: 27 Mayo 2026 - 12:00 PM
- TikTok: 30 Mayo 2026 - 09:00 AM
- YouTube: 02 Junio 2026 - 06:00 PM

================================================
CONTENT IA - HERRAMIENTA ESTRATÉGICA DE PUBLICACIÓN
================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Resumen_Generacion_Contenido.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateImage = () => {
    setIsGeneratingImg(true);
    setTimeout(() => {
      setGeneratedImg('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80');
      setIsGeneratingImg(false);
    }, 1800);
  };

  const navItems = [
    { id: 'context', icon: MessageSquare, label: 'Contexto' },
    { id: 'copies', icon: FileText, label: 'Copies' },
    { id: 'keywords', icon: Hash, label: 'Palabras clave' },
    { id: 'image', icon: ImageIcon, label: 'Imagen y miniatura' },
    { id: 'video', icon: Video, label: 'Generar video' },
    { id: 'calendar', icon: Calendar, label: 'Calendario' },
    { id: 'export', icon: Download, label: 'Exportar resumen' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Hidden File Inputs */}
      <input 
        type="file" 
        className="hidden" 
        ref={imageInputRef} 
        accept="image/*" 
        multiple 
        onChange={handleImageUpload} 
      />
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        accept=".txt,.md,.csv,.json,.pdf,.doc,.docx" 
        multiple 
        onChange={handleFileUpload} 
      />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Sparkles size={18} />
            </div>
            <h1 className="font-black text-xl tracking-tight text-slate-900 uppercase">
              CONTENT IA
            </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-gray-200">
            <span className="text-xs font-bold text-slate-500 uppercase">Campaña:</span>
            <select 
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs"
            >
              <option>Campaña Estratégica General</option>
              <option>Lanzamiento de Producto</option>
              <option>Promoción Especial</option>
              <option>Marca Personal & Servicios</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => { 
              setContextText(''); 
              setGeneratedText(''); 
              setAttachedFiles([]); 
              setActiveTab('context'); 
            }} 
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-all shadow-sm cursor-pointer"
          >
            <Plus size={16} />
            <span>Nuevo proyecto</span>
          </button>
          
          <button 
            onClick={() => alert('Sin nuevas notificaciones de campaña')} 
            className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
          </button>

          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shadow-xs border border-gray-300">
            MK
          </div>
        </div>
      </header>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-60 bg-white border-r border-gray-200 flex flex-col justify-between py-5 flex-shrink-0">
          <div className="px-3 space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Navegación
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'export') {
                      handleDownloadContentSummary();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon size={17} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Credits Box */}
          <div className="px-4 pb-2">
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-600">Archivos adjuntos</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{attachedFiles.length}</span>
              </div>
              <p className="text-[11px] text-slate-500">Imágenes y documentos analizados por la IA.</p>
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Context Section */}
            {activeTab === "context" && (
              <section className="bg-white rounded-2xl p-6 shadow-xs border border-gray-200 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Contextualiza tu contenido
                      </h2>
                      <p className="text-xs text-slate-500">
                        Sube imágenes y documentos desde tu equipo para enriquecer la generación con la IA de Gemini.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDownloadContextSummary}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-gray-200 transition-colors cursor-pointer"
                    title="Descargar reporte completo de contexto"
                  >
                    <Download size={14} className="text-blue-600" />
                    <span>Descargar Resumen de Contexto</span>
                  </button>
                </div>
                
                {/* Upload Buttons Banner */}
                <div className="bg-slate-50 border border-dashed border-gray-300 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-600">
                    <p className="font-bold text-slate-800">Carga archivos desde tu computadora:</p>
                    <p className="text-slate-500">Acepta imágenes (.png, .jpg, .webp), textos (.txt, .md, .csv) y documentos (.pdf, .docx).</p>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button 
                      onClick={() => imageInputRef.current?.click()} 
                      className="flex items-center gap-2 text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 px-3.5 py-2 rounded-lg border border-purple-200 shadow-xs transition-all cursor-pointer"
                    >
                      <ImageIcon size={15} /> + Cargar Imagen
                    </button>

                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      className="flex items-center gap-2 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 px-3.5 py-2 rounded-lg border border-blue-200 shadow-xs transition-all cursor-pointer"
                    >
                      <FileText size={15} /> + Cargar Documento
                    </button>
                  </div>
                </div>

                {/* Attached Files Grid */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Archivos cargados en el contexto ({attachedFiles.length})
                    </span>
                    {attachedFiles.length > 0 && (
                      <button 
                        onClick={() => setAttachedFiles([])} 
                        className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                      >
                        Limpiar todos
                      </button>
                    )}
                  </div>

                  {attachedFiles.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-gray-200 text-slate-400 text-xs">
                      No hay archivos adjuntos aún. Usa los botones de arriba para cargar tus recursos.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {attachedFiles.map(file => (
                        <div 
                          key={file.id} 
                          className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-xl shadow-xs hover:border-blue-300 transition-all group"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            {file.type === 'image' && file.dataUrl ? (
                              <img 
                                src={file.dataUrl} 
                                alt={file.name} 
                                className="w-10 h-10 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                <FileText size={20} />
                              </div>
                            )}

                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-slate-800 truncate" title={file.name}>
                                {file.name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-semibold">
                                {file.sizeFormatted} • {file.type.toUpperCase()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            <button 
                              onClick={() => setPreviewFile(file)} 
                              title="Previsualizar" 
                              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 cursor-pointer"
                            >
                              <Eye size={14} />
                            </button>
                            <button 
                              onClick={() => handleDownloadDoc(file)} 
                              title="Descargar" 
                              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 cursor-pointer"
                            >
                              <Download size={14} />
                            </button>
                            <button 
                              onClick={() => handleRemoveFile(file.id)} 
                              title="Eliminar" 
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-100 cursor-pointer"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tone and Platform Config */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Tono de voz:</label>
                    <select 
                      value={selectedTone}
                      onChange={(e) => setSelectedTone(e.target.value as any)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                    >
                      <option value="Sales-driven">Sales-driven (Persuasivo y Enfocado en Ventas)</option>
                      <option value="Informational">Informational (Técnico e Educativo)</option>
                      <option value="Community-centric">Community-centric (Cercano y Social)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Plataforma objetivo:</label>
                    <select 
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                    >
                      <option value="All Platforms">Todas las redes (Instagram, FB, TikTok, YT)</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="TikTok">TikTok</option>
                      <option value="LinkedIn">LinkedIn</option>
                    </select>
                  </div>
                </div>

                {/* Text Area Input */}
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Instrucciones adicionales y detalles del producto:
                  </label>
                  <textarea 
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-4 pb-14 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    rows={5}
                    value={contextText}
                    onChange={(e) => setContextText(e.target.value)}
                    placeholder="Escribe aquí las instrucciones de tu campaña, oferta especial o detalles del producto..."
                  ></textarea>

                  <div className="absolute bottom-3 right-4 flex items-center gap-3">
                    <button 
                      disabled={isGenerating || (!contextText.trim() && attachedFiles.length === 0)} 
                      onClick={handleGenerateContent} 
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer"
                    >
                      <Sparkles size={16} />
                      {isGenerating ? 'Analizando archivos y generando...' : 'Generar contenido con IA'}
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Copies Tab */}
            {(activeTab === "copies" || activeTab === "keywords") && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xs border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">
                      Copy Optimizado generado por IA
                    </h3>
                    <button
                      onClick={handleDownloadContentSummary}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold rounded-lg border border-blue-200 transition-colors cursor-pointer"
                    >
                      <Download size={14} />
                      <span>Descargar Resumen</span>
                    </button>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1">
                    <button className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-xs font-bold shadow-xs">
                      <span>Instagram</span>
                      <CheckCircle size={13} />
                    </button>
                    <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                      <span className="text-blue-600 font-black">f</span> Facebook
                    </button>
                    <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                      <span className="font-black text-black">TikTok</span>
                    </button>
                    <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                      <span className="text-red-600 font-black">▶</span> YouTube
                    </button>
                  </div>
                  
                  <div className="bg-slate-50 border border-gray-200 rounded-xl p-5 relative group">
                    <div className="text-xs text-slate-800 leading-relaxed font-mono">
                      {generatedText ? (
                        <pre className="whitespace-pre-wrap font-sans text-xs">{generatedText}</pre>
                      ) : (
                        <div className="space-y-3 font-sans">
                          <p className="font-bold text-slate-900 text-sm">
                            ¡Lleva la imagen de tu marca al siguiente nivel! 🚀
                          </p>
                          <p className="text-slate-700 text-xs leading-relaxed">
                            Diseñado con precisión estratégica para conectar de forma auténtica con tu audiencia objetivo, resaltar los beneficios más atractivos de tu producto y acelerar tus resultados comerciales. ✨
                          </p>
                          <p className="text-blue-600 font-bold text-xs">
                            #MarketingDigital #EstrategiaDeContenido #PublicidadDigital #Lanzamiento
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-90 transition-opacity">
                      <button 
                        onClick={() => { 
                          const textToCopy = generatedText || "¡Lleva la imagen de tu marca al siguiente nivel!";
                          navigator.clipboard.writeText(textToCopy); 
                          alert("¡Copy copiado al portapapeles!"); 
                        }} 
                        title="Copiar texto" 
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-white text-slate-700 hover:text-blue-600 text-xs font-bold rounded-lg shadow-xs border border-gray-200 cursor-pointer"
                      >
                        <Copy size={13} /> Copiar
                      </button>
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-2xl p-6 shadow-xs border border-gray-200 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-4">
                      Etiquetas y palabras clave SEO
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {['estrategia digital', 'marketing de contenidos', 'redes sociales', 'lanzamiento', 'posicionamiento', 'growth', 'innovacion'].map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-slate-100 border border-gray-200 text-slate-700 text-xs font-bold rounded-md flex items-center gap-1">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => alert('Etiquetas copiadas al portapapeles')}
                      className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors shadow-xs cursor-pointer"
                    >
                      <Copy size={14} /> Copiar hashtags
                    </button>
                  </div>
                </section>
              </div>
            )}

            {/* Video Tab */}
            {activeTab === "video" && (
              <div className="w-full">
                <VideoGenerator
                  selectedDay={{
                    day: 23,
                    date: '2026-05-23',
                    status: 'generated',
                    accuracyWarnings: [],
                    platforms: {
                      instagram: { text: 'Publicación estratégica de campaña de marketing.', hashtags: '#MarketingDigital #Estrategia', charCount: 150 },
                      facebook: { text: '', hashtags: '', charCount: 0 },
                      linkedin: { text: '', hashtags: '', charCount: 0 },
                      youtube: { text: '', hashtags: '', charCount: 0 },
                    }
                  }}
                  selectedMonth={{
                    monthIndex: 4,
                    themeEN: 'Marketing Campaign Launch',
                    themeES: 'Lanzamiento de Campaña de Marketing',
                    niche: 'Digital Strategy',
                    isAutoGenerated: true,
                    isComplete: true,
                    days: []
                  }}
                  language="ES"
                  apiConfigs={{ openai: '', perplexity: '', googleTrends: '' }}
                  onSaveConfigs={() => {}}
                  showToast={() => {}}
                />
              </div>
            )}

            {/* Image Tab */}
            {activeTab === "image" && (
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-200 space-y-6">
                <h3 className="text-lg font-bold text-slate-900">
                  Generación de imagen y miniatura de campaña
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Titular de la miniatura:</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none" 
                        defaultValue="¿LISTO PARA TRANSFORMAR TUS RESULTADOS?" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Prompt de imagen (Google Gemini / Imagen 3):</label>
                      <textarea 
                        className="w-full bg-slate-50 border border-gray-200 rounded-lg p-3 text-xs text-slate-800 resize-none outline-none" 
                        rows={4} 
                        defaultValue="Fotografía publicitaria hiperrealista 8K, iluminación de estudio softbox, estética limpia y moderna con paleta de colores corporativa y acabado elegante."
                      ></textarea>
                    </div>

                    <button 
                      onClick={handleGenerateImage} 
                      disabled={isGeneratingImg} 
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <Sparkles size={16} />
                      {isGeneratingImg ? 'Generando imagen HD...' : 'Crear imagen publicitaria'}
                    </button>
                  </div>

                  <div className="flex flex-col items-center justify-center bg-slate-100 rounded-xl p-4 border border-gray-200">
                    <div className="w-full max-w-xs aspect-square rounded-xl overflow-hidden relative shadow-md">
                      <img src={generatedImg} className="w-full h-full object-cover" alt="Preview Generated"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                        <span className="text-white font-black text-xs text-center w-full uppercase tracking-tight shadow-xs">
                          ¿LISTO PARA TRANSFORMAR TUS RESULTADOS?
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Calendar Tab */}
            {activeTab === "calendar" && (
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-200 space-y-6">
                <h3 className="text-lg font-bold text-slate-900">
                  Calendario de programación de contenido
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-slate-800 text-sm">Mayo 2026</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {['LUN','MAR','MIE','JUE','VIE','SAB','DOM'].map(d => (
                        <div key={d} className="text-[10px] font-bold text-slate-400 py-1">{d}</div>
                      ))}
                      {Array.from({length: 31}).map((_, i) => (
                        <div key={i} className={`aspect-square flex items-center justify-center rounded-lg font-bold text-xs relative ${
                          i+1 === 23 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200 cursor-pointer'
                        }`}>
                          {i+1}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase">Publicaciones programadas</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-slate-50 rounded-lg border border-gray-200 text-xs font-semibold flex justify-between">
                        <span>📷 Instagram Reel</span>
                        <span className="text-blue-600 font-bold">23 Mayo - 10:00 AM</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-gray-200 text-xs font-semibold flex justify-between">
                        <span>📘 Facebook Post</span>
                        <span className="text-blue-600 font-bold">27 Mayo - 12:00 PM</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-gray-200 text-xs font-semibold flex justify-between">
                        <span>🎵 TikTok Video</span>
                        <span className="text-blue-600 font-bold">30 Mayo - 09:00 AM</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => alert('¡Publicaciones programadas exitosamente!')} 
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow-sm cursor-pointer"
                    >
                      <Calendar size={15} />
                      Confirmar programación
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-gray-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="text-blue-600" size={18} />
                <span className="font-bold text-slate-800 text-sm truncate">{previewFile.name}</span>
              </div>
              <button 
                onClick={() => setPreviewFile(null)} 
                className="p-1 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 py-2">
              {previewFile.type === 'image' && previewFile.dataUrl ? (
                <img 
                  src={previewFile.dataUrl} 
                  alt={previewFile.name} 
                  className="w-full max-h-80 object-contain rounded-xl border border-gray-200 bg-slate-50"
                />
              ) : (
                <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {previewFile.textContent || 'No hay vista previa de texto disponible para este archivo.'}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button 
                onClick={() => handleDownloadDoc(previewFile)} 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100 cursor-pointer"
              >
                <Download size={14} /> Descargar
              </button>
              <button 
                onClick={() => setPreviewFile(null)} 
                className="px-4 py-1.5 bg-slate-200 text-slate-800 text-xs font-bold rounded-lg hover:bg-slate-300 cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Process Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-2.5 flex items-center justify-between text-xs font-bold text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span>CONTENT IA v2.5 • Sistema de Marketing Multimodal (Google Gemini & Runway)</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Soporte activo</span>
          <span>•</span>
          <button onClick={handleDownloadContentSummary} className="hover:text-blue-600 cursor-pointer">
            Exportar reporte global
          </button>
        </div>
      </footer>
    </div>
  );
}
