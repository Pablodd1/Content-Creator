import { useState } from 'react';
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
  Copy
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('context');
  const [selectedCampaign, setSelectedCampaign] = useState('Campaña Estratégica General');
  const [contextText, setContextText] = useState('');
  const [docs, setDocs] = useState(['Ficha_Tecnica_Campana.pdf', 'Referencia_Producto.jpg', 'Guion_Estrategico.docx']);
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [generatedImg, setGeneratedImg] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=200');

  const handleGenerateContent = async () => {
    if (!contextText.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-universal-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          want: contextText,
          language: 'ES',
          title: selectedCampaign,
          target: "Clientes potenciales y audiencia objetivo",
          objective: "Generar compromiso, visibilidad y conversiones de alto impacto",
        })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedText(data.text);
      } else {
        alert(data.error || 'Error al generar el contenido.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al generar el contenido');
    }
    setIsGenerating(false);
  };

  // Download individual document representation
  const handleDownloadDoc = (docName: string) => {
    const content = `================================================
DOCUMENTO DE CONTEXTO Y REFERENCIA
================================================
Nombre del archivo: ${docName}
Campaña activa: ${selectedCampaign}
Fecha de registro: ${new Date().toLocaleDateString('es-ES')}

DESCRIPCIÓN DEL RECURSO:
Este documento forma parte del paquete de contextualización utilizado por el equipo de marketing para alimentar el generador de contenido IA.

INFORMACIÓN REGISTRADA:
- Documento: ${docName}
- Notas adicionales: "${contextText || 'Información de campaña para desarrollo de estrategia y contenido publicitario.'}"
- Objetivo: Generación de copies, creativos visuales, video y agenda de publicación.

================================================
CONTENT IA - PLATAFORMA ESTRATÉGICA DE MARKETING
================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = docName.includes('.') ? docName : `${docName}.txt`;
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

1. ARCHIVOS Y DOCUMENTOS ADJUNTOS EN CONTEXTO:
${docs.map((d, i) => `   ${i + 1}. ${d}`).join('\n')}

2. INSTRUCCIONES Y DETALLES DE CAMPAÑA:
${contextText.trim() ? contextText : 'Campaña estratégica enfocada en maximizar la visibilidad, la interacción orgánica y las conversiones del producto o servicio.'}

3. OBJETIVOS ESTRATÉGICOS:
- Adaptación de mensajes para Instagram, Facebook, TikTok y YouTube.
- Prompts optimizados para generación de video e imágenes publicitarias.
- Palabras clave y etiquetas para posicionamiento SEO en redes.

================================================
CONTENT IA - SISTEMA DE MARKETING
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

------------------------------------------------
1. RESUMEN DEL CONTEXTO Y BRIEFING
------------------------------------------------
Archivos de contexto: ${docs.join(', ')}
Indicaciones clave: "${contextText || 'Generación de contenido de alto impacto para campañas digitales.'}"

------------------------------------------------
2. COPY GENERADO PARA REDES SOCIALES
------------------------------------------------
${generatedText || `¡Transforma la presencia de tu marca con contenido diseñado para impactar! 🚀

Publicaciones optimizadas para conectar con tu audiencia objetivo, transmitir una propuesta de valor clara y acelerar tus resultados. ✨

#EstrategiaDigital #MarketingDeContenido #Lanzamiento #Posicionamiento #Campaña2025`}

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
- Instagram: 23 Mayo 2025 - 10:00 AM
- Facebook: 27 Mayo 2025 - 12:00 PM
- TikTok: 30 Mayo 2025 - 09:00 AM
- YouTube: 02 Junio 2025 - 06:00 PM

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
      setGeneratedImg('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=500&q=80');
      setIsGeneratingImg(false);
    }, 2000);
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
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Sparkles size={16} />
            </div>
            <h1 className="font-sans font-black text-xl tracking-tight text-slate-800 uppercase">
              CONTENT IA
            </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md border border-gray-200">
            <span>Campaña actual:</span>
            <select 
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
            >
              <option>Campaña Estratégica General</option>
              <option>Lanzamiento de Producto</option>
              <option>Promoción Especial</option>
              <option>Marca Personal & Servicios</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => { 
              setContextText(''); 
              setGeneratedText(''); 
              setDocs(['Ficha_Tecnica_Campana.pdf']); 
              setActiveTab('context'); 
            }} 
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-sans text-sm font-semibold rounded-md transition-all shadow-sm cursor-pointer"
          >
            <span className="text-lg leading-none">+</span>
            <span>Nuevo proyecto</span>
          </button>
          
          <button 
            onClick={() => alert('Sin nuevas notificaciones de campaña')} 
            className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shadow-sm border border-gray-300">
            MK
          </div>
        </div>
      </header>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between py-6">
          <div className="px-4 space-y-1">
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Bottom Credits */}
          <div className="px-6 pb-4">
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-purple-500" />
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Créditos disponibles
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">1,250</div>
              <button className="text-blue-600 text-xs font-semibold hover:underline cursor-pointer">
                Ver detalles &gt;
              </button>
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Context Section */}
            {activeTab === "context" && (
              <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">
                        Contextualiza tu contenido
                      </h2>
                      <p className="text-xs text-slate-500">
                        Sube documentos, guiones o añade notas para alimentar la generación.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDownloadContextSummary}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-gray-200 transition-colors shadow-xs cursor-pointer"
                    title="Descargar reporte completo de contexto"
                  >
                    <Download size={14} className="text-blue-600" />
                    <span>Descargar Resumen de Contexto</span>
                  </button>
                </div>
                
                {/* Documents List with Download & Remove Actions */}
                <div className="mb-4">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Documentos y recursos adjuntos
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {docs.map(doc => (
                      <div key={doc} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-slate-700 shadow-sm hover:border-blue-300 transition-all">
                        <div className="p-1 bg-blue-100 text-blue-600 rounded">
                          <FileText size={14}/>
                        </div>
                        <span className="font-medium text-xs text-slate-800">{doc}</span>
                        
                        <div className="flex items-center gap-1 ml-2 border-l border-gray-200 pl-2">
                          <button 
                            onClick={() => handleDownloadDoc(doc)} 
                            title={`Descargar ${doc}`} 
                            className="p-1 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            <Download size={13} />
                          </button>
                          <button 
                            onClick={() => setDocs(docs.filter(d => d !== doc))} 
                            title="Eliminar documento" 
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <textarea 
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-4 pb-14 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    rows={4}
                    value={contextText}
                    onChange={(e) => setContextText(e.target.value)}
                    placeholder="Escribe instrucciones, detalles del producto o los objetivos de tu campaña de marketing..."
                  ></textarea>

                  <div className="absolute bottom-3 left-4 flex items-center gap-3 text-slate-500">
                    <button 
                      onClick={() => setDocs([...docs, `Imagen_Referencia_${docs.length + 1}.jpg`])} 
                      className="flex items-center gap-1.5 text-xs font-semibold hover:text-slate-800 transition-colors bg-white px-2.5 py-1 rounded border border-gray-200 shadow-sm cursor-pointer"
                    >
                      <ImageIcon size={14} className="text-purple-600" /> + Imagen
                    </button>
                    <button 
                      onClick={() => setDocs([...docs, `Documento_Campana_${docs.length + 1}.pdf`])} 
                      className="flex items-center gap-1.5 text-xs font-semibold hover:text-slate-800 transition-colors bg-white px-2.5 py-1 rounded border border-gray-200 shadow-sm cursor-pointer"
                    >
                      <FileText size={14} className="text-blue-600" /> + Documento
                    </button>
                  </div>

                  <button 
                    disabled={isGenerating || !contextText.trim()} 
                    onClick={handleGenerateContent} 
                    className="absolute bottom-3 right-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles size={16} />
                    {isGenerating ? 'Generando...' : 'Generar contenido'}
                  </button>
                </div>
              </section>
            )}

            {/* Copies & Keywords Row */}
            {(activeTab === "copies" || activeTab === "keywords") && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800">
                      Copies por red social
                    </h3>
                    <button
                      onClick={handleDownloadContentSummary}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold rounded-lg border border-blue-200 transition-colors cursor-pointer"
                    >
                      <Download size={14} />
                      <span>Descargar Resumen de Contenido</span>
                    </button>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-semibold shadow-sm flex-shrink-0">
                      <span>Instagram</span>
                      <div className="bg-white/20 p-0.5 rounded-full"><CheckCircle size={14}/></div>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors flex-shrink-0 cursor-pointer">
                      <span className="text-blue-600 font-bold">f</span> Facebook
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors flex-shrink-0 cursor-pointer">
                      <span className="font-bold">TikTok</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors flex-shrink-0 cursor-pointer">
                      <span className="text-red-600 font-bold">▶</span> YouTube
                    </button>
                  </div>
                  
                  <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 relative group" id="copy-text-container">
                    <h4 className="font-bold text-slate-800 mb-2 text-sm">Copy Optimizado para Instagram</h4>
                    
                    <div className="text-sm text-slate-700 leading-relaxed mb-4">
                      {generatedText ? (
                        <pre className="whitespace-pre-wrap font-sans text-sm">{generatedText}</pre>
                      ) : (
                        <div className="space-y-2">
                          <p className="font-semibold text-slate-800">
                            ¡Lleva tu estrategia publicitaria al siguiente nivel con contenido de alto impacto! 🚀
                          </p>
                          <p className="text-slate-600 text-xs">
                            Diseñado especialmente para destacar tu propuesta de valor, conectar de forma genuina con tu audiencia objetivo y acelerar las conversiones digitales. ✨
                          </p>
                          <p className="text-blue-600 font-bold text-xs">
                            #MarketingDigital #EstrategiaDeContenido #PublicidadDigital #Lanzamiento
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={handleDownloadContentSummary} 
                        title="Descargar reporte completo de contenido" 
                        className="p-1.5 bg-white text-slate-600 hover:text-blue-600 rounded-md shadow-sm border border-gray-200 cursor-pointer"
                      >
                        <Download size={14}/>
                      </button>
                      <button 
                        onClick={() => { 
                          const textToCopy = generatedText || "¡Lleva tu estrategia publicitaria al siguiente nivel con contenido de alto impacto! 🚀";
                          navigator.clipboard.writeText(textToCopy); 
                          alert("¡Copy copiado al portapapeles!"); 
                        }} 
                        title="Copiar al portapapeles" 
                        className="p-1.5 bg-white text-slate-600 hover:text-blue-600 rounded-md shadow-sm border border-gray-200 cursor-pointer"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    Etiquetas y palabras clave
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['estrategia digital', 'marketing de contenidos', 'redes sociales', 'lanzamiento', 'posicionamiento', 'growth'].map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-slate-50 border border-gray-200 text-slate-600 text-xs font-semibold rounded-md flex items-center gap-1.5">
                        {tag} <span className="text-slate-400 hover:text-slate-600 cursor-pointer">×</span>
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <button 
                      onClick={() => alert('Etiquetas copiadas al portapapeles')}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors shadow-sm cursor-pointer"
                    >
                      <Copy size={14} /> Copiar etiquetas
                    </button>
                    <button 
                      onClick={() => alert('Etiquetas regeneradas')}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors shadow-sm cursor-pointer"
                    >
                      ↻ Regenerar
                    </button>
                  </div>
                </section>
              </div>
            )}

            {/* Generate Video - Full Width */}
            {activeTab === "video" && (
              <div id="video" className="w-full">
                <VideoGenerator
                  selectedDay={{
                    day: 23,
                    date: '2025-05-23',
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

            {/* Bottom Row */}
            {(activeTab === "image" || activeTab === "calendar" || activeTab === "export") && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
                {/* Image & Thumbnail */}
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    Imagen y miniatura
                  </h3>
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Texto de la miniatura</label>
                        <input type="text" className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 outline-none" value="¿LISTO PARA TRANSFORMAR TUS RESULTADOS?" readOnly />
                        <div className="text-right text-[10px] text-slate-400 mt-1">28/50</div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Descripción visual</label>
                        <textarea className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-slate-700 resize-none outline-none" rows={3} value="Estudio profesional con iluminación suave, producto destacado e imagen fotorrealista 8K." readOnly></textarea>
                        <div className="text-right text-[10px] text-slate-400 mt-1">82/120</div>
                      </div>
                    </div>
                    <div className="w-28 h-36 bg-stone-200 rounded-lg overflow-hidden relative flex-shrink-0 shadow-inner">
                      <img src={generatedImg} className="w-full h-full object-cover" alt="Preview"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2">
                        <span className="text-white font-bold text-[10px] leading-tight text-center w-full shadow-sm">¿LISTO PARA TRANSFORMAR TUS RESULTADOS?</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleGenerateImage} 
                    disabled={isGeneratingImg} 
                    className="w-full mt-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles size={16} />
                    {isGeneratingImg ? 'Generando imagen...' : 'Crear imagen'}
                  </button>
                </section>

                {/* Scheduling */}
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    Programación de contenido
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 h-full">
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <button className="text-slate-400 hover:text-slate-600 cursor-pointer">&lt;</button>
                        <div className="font-bold text-slate-800 text-sm">Mayo 2025</div>
                        <button className="text-slate-400 hover:text-slate-600 cursor-pointer">&gt;</button>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['LUN','MAR','MIE','JUE','VIE','SAB','DOM'].map(d => (
                          <div key={d} className="text-[9px] font-bold text-slate-400">{d}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        {Array.from({length: 31}).map((_, i) => (
                          <div key={i} className={`aspect-square flex items-center justify-center rounded-full font-medium relative ${
                            i+1 === 23 ? 'bg-blue-600 text-white shadow-sm' : 
                            [12, 14, 18, 20, 27].includes(i+1) ? 'text-slate-800' : 'text-slate-500 hover:bg-slate-50 cursor-pointer'
                          }`}>
                            {i+1}
                            {[12, 14, 18, 20, 27].includes(i+1) && <div className="absolute w-1 h-1 bg-pink-500 rounded-full bottom-0.5"></div>}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800 mb-2">Publicaciones programadas</div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-medium text-slate-600 bg-slate-50 p-1.5 rounded border border-gray-100">
                            <div className="flex items-center gap-1.5"><span className="text-pink-500 font-bold text-xs">IG</span> 23 may 2025</div>
                            <div>🕒 10:00</div>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-medium text-slate-600 bg-slate-50 p-1.5 rounded border border-gray-100">
                            <div className="flex items-center gap-1.5"><span className="text-blue-600 font-bold text-xs">f</span> 27 may 2025</div>
                            <div>🕒 12:00</div>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-medium text-slate-600 bg-slate-50 p-1.5 rounded border border-gray-100">
                            <div className="flex items-center gap-1.5"><span className="font-bold text-xs text-black">TT</span> 30 may 2025</div>
                            <div>🕒 09:00</div>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-medium text-slate-600 bg-slate-50 p-1.5 rounded border border-gray-100">
                            <div className="flex items-center gap-1.5"><span className="text-red-600 font-bold text-xs">YT</span> 02 jun 2025</div>
                            <div>🕒 18:00</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="text-xs font-semibold text-slate-500 mb-1">Fecha y hora</div>
                        <div className="flex gap-2 mb-3">
                          <input type="text" value="23/05/2025" className="w-full bg-slate-50 border border-gray-200 rounded text-xs px-2 py-1.5 text-slate-700 font-semibold outline-none" readOnly/>
                          <input type="text" value="10:00" className="w-16 bg-slate-50 border border-gray-200 rounded text-xs px-2 py-1.5 text-slate-700 text-center font-semibold outline-none" readOnly/>
                        </div>
                        <button 
                          onClick={() => alert('¡Publicaciones programadas exitosamente en el calendario!')} 
                          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer"
                        >
                          <Calendar size={14} />
                          Programar publicaciones
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Bottom Process Bar */}
      <footer className="bg-white border-t border-gray-200 px-6 py-3 flex items-center gap-4 fixed bottom-0 left-0 right-0 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="text-sm font-bold text-slate-800 w-48">Flujo del proyecto</div>
        <div className="flex-1 flex items-center max-w-4xl">
          {['Contexto', 'Copies', 'Creativos', 'Video', 'Programación'].map((step, i) => (
            <div key={step} className="flex items-center w-full">
              <div className="flex items-center gap-2 flex-shrink-0">
                {i < 2 ? (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                    <CheckCircle size={14} />
                  </div>
                ) : i === 2 ? (
                  <div className="w-6 h-6 rounded-full border-2 border-purple-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                )}
                <span className={`text-sm font-semibold ${
                  i < 2 ? 'text-blue-600' : i === 2 ? 'text-purple-600' : 'text-slate-400'
                }`}>{step}</span>
              </div>
              {i < 4 && <div className="flex-1 h-px bg-gray-300 mx-4"></div>}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
