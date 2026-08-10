import { useState } from 'react';
import VideoGenerator from './components/VideoGenerator';
import {
  FileText,
  Video,
  PenTool,
  Sparkles,
  MessageSquare,
  Image as ImageIcon,
  Calendar,
  Download,
  Bell,
  Hash,
  CheckCircle, Copy
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<'EN' | 'ES'>('ES');
  const [activeTab, setActiveTab] = useState('context');
  const [contextText, setContextText] = useState('');
  const [docs, setDocs] = useState(['Ficha técnica.pdf', 'Referencia_producto.jpg', 'Guion_base.docx']);
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
          language,
          title: "Electric charger monitor locator and website for Colombia",
          target: "EV owners and operators in Colombia",
          objective: "Promote the fast response and efficiency of the locator app",
        })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedText(data.text);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error generating content');
    }
    setIsGenerating(false);
  };
  
  
  const handleExport = () => {
    if (!generatedText) {
      alert(language === 'EN' ? 'Nothing to export!' : '¡Nada para exportar!');
      return;
    }
    const blob = new Blob([generatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaign_copy.txt';
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
    { id: 'context', icon: MessageSquare, label: language === 'EN' ? 'Context' : 'Contexto' },
    { id: 'copies', icon: FileText, label: 'Copies' },
    { id: 'keywords', icon: Hash, label: language === 'EN' ? 'Keywords' : 'Palabras clave' },
    { id: 'image', icon: ImageIcon, label: language === 'EN' ? 'Image & Thumbnail' : 'Imagen y miniatura' },
    { id: 'video', icon: Video, label: language === 'EN' ? 'Generate Video' : 'Generar video' },
    { id: 'calendar', icon: Calendar, label: language === 'EN' ? 'Calendar' : 'Calendario' },
    { id: 'export', icon: Download, label: language === 'EN' ? 'Export' : 'Exportar' },
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
            <span>{language === 'EN' ? 'Current Campaign:' : 'Campaña actual:'}</span>
            <select className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer">
              <option>Electric Charger Monitor</option>
              <option>EV Locator Colombia</option>
            </select>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center bg-slate-100 rounded-md p-0.5 border border-gray-200 text-xs font-bold">
            <button
              onClick={() => setLanguage('ES')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                language === 'ES'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🇪🇸</span>
              <span>ES</span>
            </button>
            <button
              onClick={() => setLanguage('EN')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                language === 'EN'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🇺🇸</span>
              <span>EN</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => { setContextText(''); setGeneratedText(''); setDocs(['Ficha técnica.pdf']); setActiveTab('context'); }} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-sans text-sm font-semibold rounded-md transition-all shadow-sm">
            <span className="text-lg leading-none">+</span>
            <span>{language === 'EN' ? 'New Project' : 'Nuevo proyecto'}</span>
          </button>
          
          <button onClick={() => alert(language === 'EN' ? 'No new notifications' : 'Sin nuevas notificaciones')} className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shadow-sm border border-gray-300">
            AG
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
                      handleExport();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
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
                  {language === 'EN' ? 'Available Credits' : 'Créditos disponibles'}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">1,250</div>
              <button className="text-blue-600 text-xs font-semibold hover:underline">
                {language === 'EN' ? 'View details >' : 'Ver detalles >'}
              </button>
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Context Section */}
            {activeTab === "context" && (<section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <MessageSquare size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  {language === 'EN' ? 'Contextualize your content' : 'Contextualiza tu contenido'}
                </h2>
              </div>
              <p className="text-sm text-slate-500 mb-4">
                {language === 'EN' ? 'Share your product info, campaign or idea.' : 'Compárteme la información de tu producto, campaña o idea.'}
              </p>
              
              
              <div className="flex flex-wrap gap-3 mb-4">
                {docs.map(doc => (
                  <div key={doc} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-slate-700 shadow-sm">
                    <div className="p-1 bg-blue-100 text-blue-600 rounded"><FileText size={14}/></div>
                    <span>{doc}</span>
                    <button onClick={() => setDocs(docs.filter(d => d !== doc))} className="ml-2 text-slate-400 hover:text-slate-600">×</button>
                  </div>
                ))}
              </div>

              <div className="relative">
                <textarea 
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-4 pb-12 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  rows={3}
                  value={contextText}
                  onChange={(e) => setContextText(e.target.value)}
                  placeholder={language === 'EN' ? "Write instructions or add information..." : "Escribe instrucciones o agrega información..."}
                ></textarea>
                <div className="absolute bottom-3 left-4 flex items-center gap-3 text-slate-500">
                  <button onClick={() => setDocs([...docs, 'nueva_imagen.jpg'])} className="flex items-center gap-1.5 text-xs font-semibold hover:text-slate-800 transition-colors bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">
                    <ImageIcon size={14} /> Imagen
                  </button>
                  <button onClick={() => setDocs([...docs, 'nuevo_documento.pdf'])} className="flex items-center gap-1.5 text-xs font-semibold hover:text-slate-800 transition-colors bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">
                    <FileText size={14} /> Documento
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-semibold hover:text-slate-800 transition-colors bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">
                    <span className="font-serif font-bold text-sm leading-none">T</span> Texto
                  </button>
                </div>
                <button disabled={isGenerating || !contextText.trim()} onClick={handleGenerateContent} className="absolute bottom-3 right-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm disabled:opacity-50">
                  <Sparkles size={16} />
                  {language === 'EN' ? 'Generate Content' : 'Generar contenido'}
                </button>
              </div>
            </section>)}

            {/* Copies & Keywords Row */}
            {(activeTab === "copies" || activeTab === "keywords") && (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <section className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                 <h3 className="text-lg font-bold text-slate-800 mb-4">
                  {language === 'EN' ? 'Copies by Social Network' : 'Copies por red social'}
                 </h3>
                 <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                   <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-semibold shadow-sm flex-shrink-0">
                     <span>Instagram</span>
                     <div className="bg-white/20 p-0.5 rounded-full"><CheckCircle size={14}/></div>
                   </button>
                   <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors flex-shrink-0">
                     <span className="text-blue-600 font-bold">f</span> Facebook
                   </button>
                   <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors flex-shrink-0">
                     <span className="font-bold">TikTok</span>
                   </button>
                   <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors flex-shrink-0">
                     <span className="text-red-600 font-bold">▶</span> YouTube
                   </button>
                 </div>
                 
                 <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 relative group" id="copy-text-container">
                   <h4 className="font-bold text-slate-800 mb-2">Copy para Instagram</h4>
                   <p className="text-sm text-slate-600 leading-relaxed mb-4">
                     {generatedText ? <pre className="whitespace-pre-wrap font-sans text-sm">{generatedText}</pre> : (
    <>
      Boost your EV charging station visibility with our Monitor Locator in Colombia!<br/>
   Fast, dynamic, and efficient locator helping thousands of users every day. ✨<br/><br/>
   #EVCharging #Colombia #ElectricVehicles
    </>
  )}
                   </p>
                   
                    <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={handleExport} title="Download" className="p-1.5 bg-white text-slate-600 hover:text-blue-600 rounded-md shadow-sm border border-gray-200"><Download size={14}/></button>
                      <button onClick={() => { if(generatedText) { navigator.clipboard.writeText(generatedText); alert("Copied!"); } }} title="Copy" className="p-1.5 bg-white text-slate-600 hover:text-blue-600 rounded-md shadow-sm border border-gray-200"><Copy size={14} /></button>
                    </div>

                 </div>
              </section>

              <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  {language === 'EN' ? 'Tags and Keywords' : 'Etiquetas y palabras clave'}
                 </h3>
                 <div className="flex flex-wrap gap-2 mb-6">
                   {['remodelación', 'diseño interior', 'panel WPC', 'paredes modernas', 'arquitectura'].map(tag => (
                     <span key={tag} className="px-3 py-1.5 bg-slate-50 border border-gray-200 text-slate-600 text-xs font-semibold rounded-md flex items-center gap-1.5">
                       {tag} <span className="text-slate-400 hover:text-slate-600 cursor-pointer">×</span>
                     </span>
                   ))}
                 </div>
                 <div className="flex items-center justify-between mt-auto">
                   <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors shadow-sm">
                     📋 {language === 'EN' ? 'Copy Tags' : 'Copiar etiquetas'}
                   </button>
                   <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors shadow-sm">
                     ↻ {language === 'EN' ? 'Regenerate' : 'Regenerar'}
                   </button>
                  </div>
               </section>
            </div>)}

            {/* Generate Video - Full Width */}
            {activeTab === "video" && (<div id="video" className="w-full">
              <VideoGenerator
                selectedDay={{
                  day: 23,
                  date: '2025-05-23',
                  status: 'generated',
                  accuracyWarnings: [],
                  platforms: {
                    instagram: { text: 'Dale a tus espacios el cambio que merecen con Panel WPC.', hashtags: '#PanelWPC #DiseñoInterior', charCount: 150 },
                    facebook: { text: '', hashtags: '', charCount: 0 },
                    linkedin: { text: '', hashtags: '', charCount: 0 },
                    youtube: { text: '', hashtags: '', charCount: 0 },
                  }
                }}
                selectedMonth={{
                  monthIndex: 4,
                  themeEN: 'WPC Panel Launch',
                  themeES: 'Lanzamiento Panel WPC',
                  niche: 'Interior Design',
                  isAutoGenerated: true,
                  isComplete: true,
                  days: []
                }}
                language={language}
                apiConfigs={{ openai: '', perplexity: '', googleTrends: '' }}
                onSaveConfigs={() => {}}
                showToast={() => {}}
              />
            </div>)}

            {/* Bottom Row */}
            {(activeTab === "image" || activeTab === "calendar" || activeTab === "export") && (<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
              {/* Image & Thumbnail */}
              <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  {language === 'EN' ? 'Image and Thumbnail' : 'Imagen y miniatura'}
                </h3>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Texto de la miniatura</label>
                      <input type="text" className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700" value="¿LISTO PARA TRANSFORMAR TU ESPACIO?" readOnly />
                      <div className="text-right text-[10px] text-slate-400 mt-1">22/50</div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Descripción visual</label>
                      <textarea className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-slate-700 resize-none" rows={3} value="Espacio moderno, producto protagonista y luz natural" readOnly></textarea>
                      <div className="text-right text-[10px] text-slate-400 mt-1">50/120</div>
                    </div>
                  </div>
                  <div className="w-24 h-32 bg-stone-200 rounded-lg overflow-hidden relative flex-shrink-0 shadow-inner">
                    <img src={generatedImg} className="w-full h-full object-cover" alt="Preview"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2">
                      <span className="text-white font-bold text-[10px] leading-tight text-center w-full shadow-sm">¿LISTO PARA TRANSFORMAR TU ESPACIO?</span>
                    </div>
                  </div>
                </div>
                <button onClick={handleGenerateImage} disabled={isGeneratingImg} className="w-full mt-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm disabled:opacity-50">
                  <Sparkles size={16} />
                  {language === 'EN' ? 'Create Image' : 'Crear imagen'}
                </button>
              </section>

              {/* Scheduling */}
              <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  {language === 'EN' ? 'Content Scheduling' : 'Programación de contenido'}
                </h3>
                
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <button className="text-slate-400 hover:text-slate-600">&lt;</button>
                      <div className="font-bold text-slate-800 text-sm">Mayo 2025</div>
                      <button className="text-slate-400 hover:text-slate-600">&gt;</button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {['LUN','MAR','MIE','JUE','VIE','SAB','DOM'].map(d => (
                        <div key={d} className="text-[9px] font-bold text-slate-400">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {/* Fake Calendar grid */}
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
                          <div className="flex items-center gap-1.5"><span className="text-pink-500 text-xs">IG</span> 23 may 2025</div>
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
                      <button onClick={() => alert(language === 'EN' ? 'Scheduled successfully!' : '¡Programado exitosamente!')} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm">
                        <Calendar size={14} />
                        {language === 'EN' ? 'Schedule' : 'Programar publicaciones'}
                      </button>
                    </div>
                  </div>
                </div>
              </section>

            </div>)}

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
