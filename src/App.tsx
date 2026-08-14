import React, { useState, useEffect, useRef } from 'react';
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
  Layers,
  Loader2,
  Sun,
  Moon
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
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('unitec_active_tab') || 'context';
  });
  const [selectedCampaign, setSelectedCampaign] = useState(() => {
    return localStorage.getItem('unitec_selected_campaign') || 'Campaña Estratégica General';
  });
  const [selectedTone, setSelectedTone] = useState<'Sales-driven' | 'Informational' | 'Community-centric'>('Sales-driven');
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');
  const [contextText, setContextText] = useState(() => {
    return localStorage.getItem('unitec_context_text') || '';
  });
  
  // Attached files state with full object details
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>(() => {
    try {
      const saved = localStorage.getItem('unitec_attached_files');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
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
    ];
  });

  const [generatedText, setGeneratedText] = useState(() => {
    return localStorage.getItem('unitec_generated_text') || '';
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [generatedImg, setGeneratedImg] = useState(() => {
    return localStorage.getItem('unitec_generated_img') || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1080';
  });
  const [imageTitle, setImageTitle] = useState(() => {
    return localStorage.getItem('unitec_image_title') || '¿LISTO PARA TRANSFORMAR TUS RESULTADOS?';
  });
  const [imagePrompt, setImagePrompt] = useState(() => {
    return localStorage.getItem('unitec_image_prompt') || 'Fotografía publicitaria hiperrealista 8K, iluminación de estudio softbox, estética limpia y moderna con paleta de colores corporativa y acabado elegante.';
  });
  const [imageRatio, setImageRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [imageError, setImageError] = useState('');
  const [imageSuccessNotice, setImageSuccessNotice] = useState('');
  const [previewFile, setPreviewFile] = useState<AttachedFile | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('unitec_theme') as 'light' | 'dark') || 'light';
  });

  // Sync theme to DOM and localStorage
  useEffect(() => {
    localStorage.setItem('unitec_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('unitec_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('unitec_selected_campaign', selectedCampaign);
  }, [selectedCampaign]);

  useEffect(() => {
    localStorage.setItem('unitec_context_text', contextText);
  }, [contextText]);

  useEffect(() => {
    localStorage.setItem('unitec_generated_text', generatedText);
  }, [generatedText]);

  useEffect(() => {
    localStorage.setItem('unitec_generated_img', generatedImg);
  }, [generatedImg]);

  useEffect(() => {
    localStorage.setItem('unitec_image_title', imageTitle);
  }, [imageTitle]);

  useEffect(() => {
    localStorage.setItem('unitec_image_prompt', imagePrompt);
  }, [imagePrompt]);

  useEffect(() => {
    try {
      localStorage.setItem('unitec_attached_files', JSON.stringify(attachedFiles));
    } catch (e) {
      console.error(e);
    }
  }, [attachedFiles]);

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
        
        // Auto-extract visual prompt if present
        const visualPromptMatch = data.text.match(/\[PROMPT PARA CREATIVO VISUAL[^\]]*\]\s*([\s\S]*?)(?=\n\n(?:[✨📖🔒🎯🎬🏷️]|$))/i);
        if (visualPromptMatch && visualPromptMatch[1]) {
          const extractedPrompt = visualPromptMatch[1].replace(/^\([^)]*\)\s*/gm, '').trim();
          if (extractedPrompt) {
            setImagePrompt(extractedPrompt);
          }
        }

        // Auto-extract hook / title if present
        const hookMatch = data.text.match(/\[TITULAR IMPACTANTE[^\]]*\]\s*([\s\S]*?)(?=\n\n(?:[✨📖🔒🎯🎬🏷️]|$))/i);
        if (hookMatch && hookMatch[1]) {
          const cleanHook = hookMatch[1].replace(/^\([^)]*\)\s*/gm, '').replace(/["']/g, '').trim();
          if (cleanHook) {
            setImageTitle(cleanHook);
          }
        }

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

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      setImageError('Por favor ingresa una descripción para la imagen.');
      return;
    }
    setIsGeneratingImg(true);
    setImageError('');
    setImageSuccessNotice('');

    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          aspectRatio: imageRatio
        })
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setGeneratedImg(data.imageUrl);
        if (data.notice) {
          setImageSuccessNotice(data.notice);
        }
      } else {
        setImageError(data.error || 'No se pudo generar la imagen.');
      }
    } catch (err: any) {
      console.error('Error generating image:', err);
      setImageError('Error de conexión al generar la imagen publicitaria.');
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handleDownloadImage = () => {
    if (!generatedImg) return;
    const a = document.createElement('a');
    a.href = generatedImg;
    a.download = `Imagen_Publicitaria_${Date.now()}.png`;
    if (generatedImg.startsWith('http')) {
      a.target = '_blank';
    }
    a.click();
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
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200`}>
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
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 shadow-xs border-b border-gray-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Sparkles size={18} />
            </div>
            <h1 className="font-black text-xl tracking-tight text-slate-900 dark:text-white uppercase">
              CONTENT IA
            </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Campaña:</span>
            <select 
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="bg-transparent font-bold text-slate-800 dark:text-slate-100 outline-none cursor-pointer text-xs"
            >
              <option className="dark:bg-slate-850 dark:text-white">Campaña Estratégica General</option>
              <option className="dark:bg-slate-850 dark:text-white">Lanzamiento de Producto</option>
              <option className="dark:bg-slate-850 dark:text-white">Promoción Especial</option>
              <option className="dark:bg-slate-850 dark:text-white">Marca Personal & Servicios</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-lg text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Memoria Activa</span>
          </div>

          {/* Theme Toggle Button (Light / Dark Mode) */}
          <button 
            id="theme-toggle-header-btn"
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} 
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro (reduce fatiga visual nocturna)'}
            aria-label="Cambiar tema visual"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun size={15} className="text-amber-400" />
                <span className="hidden sm:inline">Modo Claro</span>
              </>
            ) : (
              <>
                <Moon size={15} className="text-indigo-600" />
                <span className="hidden sm:inline">Modo Oscuro</span>
              </>
            )}
          </button>

          <button 
            onClick={() => { 
              if (confirm('¿Deseas iniciar un nuevo proyecto? Esto limpiará el contexto actual.')) {
                setContextText(''); 
                setGeneratedText(''); 
                setAttachedFiles([]); 
                setActiveTab('context'); 
              }
            }} 
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-all shadow-sm cursor-pointer"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Nuevo proyecto</span>
          </button>
          
          <button 
            onClick={() => alert('Sin nuevas notificaciones de campaña')} 
            className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
          </button>

          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-xs shadow-xs border border-gray-300 dark:border-slate-700">
            MK
          </div>
        </div>
      </header>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-60 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col justify-between py-5 flex-shrink-0 transition-colors">
          <div className="px-3 space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
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
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon size={17} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Credits Box */}
          <div className="px-4 pb-2">
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-750 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Archivos adjuntos</span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/70 px-2 py-0.5 rounded-full">{attachedFiles.length}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Imágenes y documentos analizados por la IA.</p>
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 md:p-8 transition-colors">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Context Section */}
            {activeTab === "context" && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xs border border-gray-200 dark:border-slate-800 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Contextualiza tu contenido
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Sube imágenes y documentos desde tu equipo para enriquecer la generación con la IA de Gemini.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDownloadContextSummary}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg border border-gray-200 dark:border-slate-700 transition-colors cursor-pointer"
                    title="Descargar reporte completo de contexto"
                  >
                    <Download size={14} className="text-blue-600 dark:text-blue-400" />
                    <span>Descargar Resumen de Contexto</span>
                  </button>
                </div>
                
                {/* Upload Buttons Banner */}
                <div className="bg-slate-50 dark:bg-slate-950/70 border border-dashed border-gray-300 dark:border-slate-700 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    <p className="font-bold text-slate-800 dark:text-slate-100">Carga archivos desde tu computadora:</p>
                    <p className="text-slate-500 dark:text-slate-400">Acepta imágenes (.png, .jpg, .webp), textos (.txt, .md, .csv) y documentos (.pdf, .docx).</p>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button 
                      onClick={() => imageInputRef.current?.click()} 
                      className="flex items-center gap-2 text-xs font-bold bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 px-3.5 py-2 rounded-lg border border-purple-200 dark:border-purple-800 shadow-xs transition-all cursor-pointer"
                    >
                      <ImageIcon size={15} /> + Cargar Imagen
                    </button>

                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      className="flex items-center gap-2 text-xs font-bold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-3.5 py-2 rounded-lg border border-blue-200 dark:border-blue-800 shadow-xs transition-all cursor-pointer"
                    >
                      <FileText size={15} /> + Cargar Documento
                    </button>
                  </div>
                </div>

                {/* Attached Files Grid */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Archivos cargados en el contexto ({attachedFiles.length})
                    </span>
                    {attachedFiles.length > 0 && (
                      <button 
                        onClick={() => setAttachedFiles([])} 
                        className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                      >
                        Limpiar todos
                      </button>
                    )}
                  </div>

                  {attachedFiles.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-gray-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs">
                      No hay archivos adjuntos aún. Usa los botones de arriba para cargar tus recursos.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {attachedFiles.map(file => (
                        <div 
                          key={file.id} 
                          className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xs hover:border-blue-300 dark:hover:border-blue-500 transition-all group"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            {file.type === 'image' && file.dataUrl ? (
                              <img 
                                src={file.dataUrl} 
                                alt={file.name} 
                                className="w-10 h-10 object-cover rounded-lg border border-gray-200 dark:border-slate-700 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                                <FileText size={20} />
                              </div>
                            )}

                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title={file.name}>
                                {file.name}
                              </p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                                {file.sizeFormatted} • {file.type.toUpperCase()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            <button 
                              onClick={() => setPreviewFile(file)} 
                              title="Previsualizar" 
                              className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                            >
                              <Eye size={14} />
                            </button>
                            <button 
                              onClick={() => handleDownloadDoc(file)} 
                              title="Descargar" 
                              className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                            >
                              <Download size={14} />
                            </button>
                            <button 
                              onClick={() => handleRemoveFile(file.id)} 
                              title="Eliminar" 
                              className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
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
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Tono de voz:</label>
                    <select 
                      value={selectedTone}
                      onChange={(e) => setSelectedTone(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                    >
                      <option value="Sales-driven" className="dark:bg-slate-850">Sales-driven (Persuasivo y Enfocado en Ventas)</option>
                      <option value="Informational" className="dark:bg-slate-850">Informational (Técnico e Educativo)</option>
                      <option value="Community-centric" className="dark:bg-slate-850">Community-centric (Cercano y Social)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Plataforma objetivo:</label>
                    <select 
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                    >
                      <option value="All Platforms" className="dark:bg-slate-850">Todas las redes (Instagram, FB, TikTok, YT)</option>
                      <option value="Instagram" className="dark:bg-slate-850">Instagram</option>
                      <option value="Facebook" className="dark:bg-slate-850">Facebook</option>
                      <option value="TikTok" className="dark:bg-slate-850">TikTok</option>
                      <option value="LinkedIn" className="dark:bg-slate-850">LinkedIn</option>
                    </select>
                  </div>
                </div>

                {/* Text Area Input */}
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Instrucciones adicionales y detalles del producto:
                  </label>
                  <textarea 
                    className="w-full bg-slate-50 dark:bg-slate-800/70 border border-gray-200 dark:border-slate-700 rounded-xl p-4 pb-14 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none placeholder-slate-400 dark:placeholder-slate-500"
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
                <section className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xs border border-gray-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Copy Optimizado generado por IA
                    </h3>
                    <button
                      onClick={handleDownloadContentSummary}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-xs font-bold rounded-lg border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
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
                    <button className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                      <span className="text-blue-600 font-black">f</span> Facebook
                    </button>
                    <button className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                      <span className="font-black text-slate-900 dark:text-white">TikTok</span>
                    </button>
                    <button className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                      <span className="text-red-600 font-black">▶</span> YouTube
                    </button>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-950/70 border border-gray-200 dark:border-slate-800 rounded-xl p-5 relative group">
                    <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono">
                      {generatedText ? (
                        <pre className="whitespace-pre-wrap font-sans text-xs">{generatedText}</pre>
                      ) : (
                        <div className="space-y-3 font-sans">
                          <p className="font-bold text-slate-900 dark:text-white text-sm">
                            ¡Lleva la imagen de tu marca al siguiente nivel! 🚀
                          </p>
                          <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                            Diseñado con precisión estratégica para conectar de forma auténtica con tu audiencia objetivo, resaltar los beneficios más atractivos de tu producto y acelerar tus resultados comerciales. ✨
                          </p>
                          <p className="text-blue-600 dark:text-blue-400 font-bold text-xs">
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
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold rounded-lg shadow-xs border border-gray-200 dark:border-slate-700 cursor-pointer"
                      >
                        <Copy size={13} /> Copiar
                      </button>
                    </div>
                  </div>
                </section>

                <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xs border border-gray-200 dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                      Etiquetas y palabras clave SEO
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {['estrategia digital', 'marketing de contenidos', 'redes sociales', 'lanzamiento', 'posicionamiento', 'growth', 'innovacion'].map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-md flex items-center gap-1">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
                    <button 
                      onClick={() => alert('Etiquetas copiadas al portapapeles')}
                      className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors shadow-xs cursor-pointer"
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
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xs border border-gray-200 dark:border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Generación de Imagen y Creativo Publicitario
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Crea imágenes comerciales de alta fidelidad optimizadas para redes y portadas
                    </p>
                  </div>
                  {generatedImg && (
                    <button
                      onClick={handleDownloadImage}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg border border-gray-200 dark:border-slate-700 transition-all cursor-pointer"
                    >
                      <Download size={14} />
                      Descargar Imagen
                    </button>
                  )}
                </div>

                {imageError && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 font-medium">
                    ⚠️ {imageError}
                  </div>
                )}

                {imageSuccessNotice && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    ✨ {imageSuccessNotice}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Titular superpuesto / Hook visual:</label>
                      <input 
                        type="text" 
                        value={imageTitle}
                        onChange={(e) => setImageTitle(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500" 
                        placeholder="Ej. ¿LISTO PARA TRANSFORMAR TUS RESULTADOS?"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Prompt visual para Google Gemini Imagen:</label>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(imagePrompt);
                          }}
                          className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                        >
                          <Copy size={11} /> Copiar Prompt
                        </button>
                      </div>
                      <textarea 
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-lg p-3 text-xs text-slate-800 dark:text-slate-100 resize-none outline-none focus:border-blue-500 placeholder-slate-400 dark:placeholder-slate-500" 
                        rows={4} 
                        placeholder="Describe detalladamente los elementos, estilo, iluminación y textura..."
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Formato / Relación de Aspecto:</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { id: '1:1', label: '1:1 Cuadrado', desc: 'Feed / Post' },
                          { id: '16:9', label: '16:9 Banner', desc: 'Facebook / Web' },
                          { id: '9:16', label: '9:16 Vertical', desc: 'Story / Reel' },
                          { id: '4:3', label: '4:3 Estándar', desc: 'Catálogo' }
                        ].map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setImageRatio(r.id as any)}
                            className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                              imageRatio === r.id 
                                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-bold' 
                                : 'border-gray-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 font-medium'
                            }`}
                          >
                            <div className="text-[11px]">{r.label}</div>
                            <div className="text-[9px] text-slate-400 dark:text-slate-500">{r.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={handleGenerateImage} 
                      disabled={isGeneratingImg} 
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      {isGeneratingImg ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Generando imagen en alta definición...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          Crear Imagen Publicitaria con IA
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-col items-center justify-center bg-slate-100/70 dark:bg-slate-950/70 rounded-xl p-4 border border-gray-200 dark:border-slate-800 min-h-[280px]">
                    <div className={`w-full max-w-sm rounded-xl overflow-hidden relative shadow-md bg-black ${
                      imageRatio === '16:9' ? 'aspect-video' : 
                      imageRatio === '9:16' ? 'aspect-[9/16] max-w-[200px]' : 
                      imageRatio === '4:3' ? 'aspect-[4/3]' : 'aspect-square'
                    }`}>
                      <img 
                        src={generatedImg} 
                        className="w-full h-full object-cover" 
                        alt="Preview Generated"
                        referrerPolicy="no-referrer"
                      />
                      {imageTitle && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent flex items-end p-4">
                          <span className="text-white font-black text-xs sm:text-sm text-center w-full uppercase tracking-tight drop-shadow-md">
                            {imageTitle}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      <span>Proporción: {imageRatio}</span>
                      <span>•</span>
                      <span>Calidad: 1080p Ultra HD</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Calendar Tab */}
            {activeTab === "calendar" && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xs border border-gray-200 dark:border-slate-800 space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Calendario de programación de contenido
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">Mayo 2026</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {['LUN','MAR','MIE','JUE','VIE','SAB','DOM'].map(d => (
                        <div key={d} className="text-[10px] font-bold text-slate-400 dark:text-slate-500 py-1">{d}</div>
                      ))}
                      {Array.from({length: 31}).map((_, i) => (
                        <div key={i} className={`aspect-square flex items-center justify-center rounded-lg font-bold text-xs relative ${
                          i+1 === 23 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer'
                        }`}>
                          {i+1}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Publicaciones programadas</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-semibold flex justify-between">
                        <span className="text-slate-800 dark:text-slate-200">📷 Instagram Reel</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">23 Mayo - 10:00 AM</span>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-semibold flex justify-between">
                        <span className="text-slate-800 dark:text-slate-200">📘 Facebook Post</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">27 Mayo - 12:00 PM</span>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-semibold flex justify-between">
                        <span className="text-slate-800 dark:text-slate-200">🎵 TikTok Video</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">30 Mayo - 09:00 AM</span>
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-gray-200 dark:border-slate-800 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="text-blue-600 dark:text-blue-400" size={18} />
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{previewFile.name}</span>
              </div>
              <button 
                onClick={() => setPreviewFile(null)} 
                className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 py-2">
              {previewFile.type === 'image' && previewFile.dataUrl ? (
                <img 
                  src={previewFile.dataUrl} 
                  alt={previewFile.name} 
                  className="w-full max-h-80 object-contain rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
              ) : (
                <div className="bg-slate-50 dark:bg-slate-950/70 border border-gray-200 dark:border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {previewFile.textContent || 'No hay vista previa de texto disponible para este archivo.'}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-slate-800">
              <button 
                onClick={() => handleDownloadDoc(previewFile)} 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 cursor-pointer"
              >
                <Download size={14} /> Descargar
              </button>
              <button 
                onClick={() => setPreviewFile(null)} 
                className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Process Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 px-6 py-2.5 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span>CONTENT IA v2.5 • Sistema de Marketing Multimodal (Google Gemini & Veo 3.1)</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
          <span>Soporte activo</span>
          <span>•</span>
          <button onClick={handleDownloadContentSummary} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
            Exportar reporte global
          </button>
        </div>
      </footer>
    </div>
  );
}
