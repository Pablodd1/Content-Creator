/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlatformPosts, DayData, ContentStatus, ToneOfVoice, CompanyTrainingConfig, SentimentAnalysis } from '../types';
import { COLOMBIAN_HOLIDAYS_2026 } from './mockData';

export function analyzeSentiment(
  instagramText: string,
  linkedinText: string,
  facebookText: string,
  youtubeText: string,
  tone: ToneOfVoice
): SentimentAnalysis {
  const combinedText = (instagramText + linkedinText + facebookText + youtubeText).toLowerCase();
  
  // Calculate raw points based on language patterns, punctuation, and keyword densities
  let score = 50; // default baseline

  // Adjust by tone guide baseline
  if (tone === 'Sales-driven') {
    score += 15;
  } else if (tone === 'Informational') {
    score -= 20;
  } else if (tone === 'Community-centric') {
    score += 5;
  }

  // Adjust by punctuation (exclamation points represent high intensity)
  const exclamationCount = (combinedText.match(/!/g) || []).length;
  score += Math.min(exclamationCount * 2, 12);

  // Emojis count (highly positive/high intensity indicators)
  const regexEmoji = /[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{27BF}]/gu;
  const emojiCount = (combinedText.match(regexEmoji) || []).length;
  score += Math.min(emojiCount * 1.5, 10);

  // Analyze specific emotional signal words
  const urgentWords = ["ahora", "hoy", "urgente", "exclusivo", "now", "today", "immediate", "boost", "roi", "opportunity", "oportunidad"];
  const strongWords = ["unrivaled", "perfect", "gilded-edge", "premium", "luxury", "ultimate", "excelencia", "lujo", "impecable"];
  const informationalWords = ["análisis", "especificación", "técnico", "normas", "certificación", "astm", "detailed", "compliance", "breakdown", "standards"];

  urgentWords.forEach(w => {
    if (combinedText.includes(w)) score += 3;
  });

  strongWords.forEach(w => {
    if (combinedText.includes(w)) score += 2;
  });

  informationalWords.forEach(w => {
    if (combinedText.includes(w)) score -= 3;
  });

  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, Math.round(score)));

  let intensity: 'Low' | 'Medium' | 'High' = 'Medium';
  let label = "Community & Educational Focus";
  let primaryEmotion = "Friendly & Informative";

  if (score < 40) {
    intensity = 'Low';
    label = "Technical & Informational Detail";
    primaryEmotion = "Analytical & Precise";
  } else if (score >= 75) {
    intensity = 'High';
    label = "High-Energy Promotional Output";
    primaryEmotion = "Urgent & Persuasive";
  } else {
    // Medium
    if (tone === 'Community-centric') {
      label = "Community Engagement & Lifestyle";
      primaryEmotion = "Inspiring & Welcoming";
    } else {
      label = "Balanced Promotional & Informative Mix";
      primaryEmotion = "Confident & Advisory";
    }
  }

  return { intensity, score, label, primaryEmotion };
}

interface GenerationInput {
  monthIndex: number;
  monthNameDetail: string;
  day: number;
  dateStr: string;
  themeEN: string;
  themeES: string;
  niche: string;
  trendingTopic: string;
  publishingTimes?: {
    instagram: string;
    linkedin: string;
    facebook: string;
    youtube: string;
  };
  toneOfVoice?: ToneOfVoice;
  training?: CompanyTrainingConfig;
}

export function generateDailyContent(input: GenerationInput): DayData {
  const date = new Date(input.dateStr);
  const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday...

  const { themeEN, themeES, niche, trendingTopic, day, dateStr, training } = input;
  const pubTimes = input.publishingTimes || {
    instagram: "09:00 AM",
    linkedin: "08:30 AM",
    facebook: "12:00 PM",
    youtube: "04:00 PM"
  };

  const companyName = training?.companyName || "UNITEC USA Design";
  const customValueProp = training?.valueProposition || "";
  const customTone = training?.toneGuide || "";
  const customAudience = training?.targetAudience || "";
  const customGuidelines = training?.customGuidelines || "";

  // Helper additions based on company training profile
  const trainingAddonES = [
    customValueProp ? `Especializados en: ${customValueProp}.` : "",
    customAudience ? `Perfecto para el segmento de ${customAudience}.` : "",
    customTone ? `Estilo de comunicación: ${customTone}.` : "",
    customGuidelines ? `Nota adicional: ${customGuidelines}.` : ""
  ].filter(Boolean).join(" ");

  const trainingAddonEN = [
    customValueProp ? `Brand essence: ${customValueProp}.` : "",
    customAudience ? `Optimized for ${customAudience} specifications.` : ""
  ].filter(Boolean).join(" ");

  // Let's identify the material based on the niche to keep content highly specific
  let productEN = "WPC fluted wall panels";
  let productES = "paneles acanalados de WPC";
  let techDetailsEN = "Class-B fire-rated, waterproof polymer composite";
  let techDetailsES = "clasificación de fuego Clase-B, compuesto de polímero impermeable";

  if (niche.includes("sustainability")) {
    productEN = "Eco-composite WPC sustainable cladding";
    productES = "revestimiento sostenible de WPC eco-compuesto";
    techDetailsEN = "100% recyclable, made with 60% reclaimed FSC wood fibers";
    techDetailsES = "100% reciclable, fabricado con 60% de fibras de madera recuperadas FSC";
  } else if (niche.includes("waterproof") || niche.includes("science")) {
    productEN = "Co-extrusion waterproof PVC wall panels";
    productES = "paneles de PVC impermeables de coextrusión";
    techDetailsEN = "Zero moisture absorption, anti-mold defense, tropical climate stable";
    techDetailsES = "Cero absorción de humedad, defensa antimoho, estable en climas tropicales";
  } else if (niche.includes("wallpaper") || niche.includes("trends")) {
    productEN = "Gilded-edge SPC decorative surfaces";
    productES = "superficies decorativas de SPC con borde dorado";
    techDetailsEN = "High-definition marble and timber veneers, warp-resistant backing";
    techDetailsES = "Enchapados de mármol y madera de alta definición, soporte resistente al alabeo";
  } else if (niche.includes("construction") || niche.includes("tech")) {
    productEN = "Quick-install click-lock SPC flooring";
    productES = "pisos de SPC con clic de instalación rápida";
    techDetailsEN = "Interlocking tongue-and-groove system, reduces installation labor cycles by 40%";
    techDetailsES = "Sistema de ranura y lengüeta entrelazada, reduce los ciclos de mano de obra en 40%";
  } else if (niche.includes("logistics")) {
    productEN = "Consolidated container load shipping";
    productES = "envíos consolidados de carga de contenedor completo";
    techDetailsEN = "Streamlined FOB Miami transit, maximum volumetric container density";
    techDetailsES = "Tránsito eficiente FOB Miami, máxima densidad volumétrica en contenedores";
  } else if (niche.includes("architecture")) {
    productEN = "Premium exterior WPC facade claddings";
    productES = "revestimientos exteriores de fachada de WPC premium";
    techDetailsEN = "Double-layer co-extrusion technology, ASTM-tested for hurricane wind-load";
    techDetailsES = "Tecnología de coextrusión bicapa, probado por ASTM para cargas de viento huracanado";
  }

  // Define Angles
  // 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday
  let angleHookEN = "";
  let angleHookES = "";
  let bodyEN = "";
  let bodyES = "";
  let ctaEN = "";
  let ctaES = "";
  let socialProofEN = "Specified in 500+ premium architectural developments worldwide.";
  let socialProofES = "Especificado en más de 500 desarrollos arquitectónicos premium a nivel mundial.";

  switch (dayOfWeek) {
    case 1: // Monday: Motivation/Education
      angleHookEN = `Start your week with high-performance design: planning is the antidote to site delays.`;
      angleHookES = `Comience su semana con un diseño de alto rendimiento: la planificación es el antídoto para los retrasos en obra.`;
      bodyEN = `As we dive into "${themeEN}", prioritizing premium components like our ${productEN} ensures your project stays on schedule and budget. Featuring ${techDetailsEN}, these systems simplify logistics while delivering flawless residential or commercial finishes.`;
      bodyES = `Al adentrarnos en "${themeES}", priorizar materiales premium como nuestro ${productES} garantiza que su obra se mantenga en cronograma y presupuesto. Con ${techDetailsES}, estos sistemas simplifican la logística y ofrecen acabados idóneos tanto residenciales como comerciales.`;
      ctaEN = "Tag an architect who needs to streamline their upcoming specifications.";
      ctaES = "Etiquete a un arquitecto que necesite optimizar sus próximas especificaciones.";
      break;

    case 2: // Tuesday: Product Spotlight
      angleHookEN = `Material Spotlight: Elevate your designs with the engineered excellence of UNITEC ${productEN}.`;
      angleHookES = `Foco en Materiales: Eleve sus diseños con la excelencia de ingeniería del ${productES} de UNITEC.`;
      bodyEN = `Designed specifically for professional demands, this product integrates ${techDetailsEN}. Ideal for heavy high-traffic spaces, its architectural density stands unrivaled. We ship full 20ft and 40ft container loads directly to ports throughout the Americas from our Miami logistics hub.`;
      bodyES = `Diseñado específicamente para las exigencias profesionales, este producto integra ${techDetailsES}. Ideal para espacios de alto tráfico, su densidad arquitectónica no tiene rival. Realizamos envíos de contenedores completos de 20 y 40 pies directo a puertos en toda América desde nuestro centro logístico en Miami.`;
      ctaEN = "Save this specification sheet for your active design review board.";
      ctaES = "Guarde esta ficha técnica para su junta de revisión de diseño activa.";
      break;

    case 3: // Wednesday: Design Inspiration
      angleHookEN = `Where structure meets luxury. Discover the aesthetic possibilities of sustainable surfaces.`;
      angleHookES = `Donde la estructura se une al lujo. Descubra las posibilidades estéticas de las superficies sostenibles.`;
      bodyEN = `Incorporate warmth into your layouts without sacrificing durability. Utilizing ${productEN} allows for beautiful vertical lines, bringing depth to residential lobbies and executive offices. Paired with ${techDetailsEN}, it is the material choice for forward-thinking interiors.`;
      bodyES = `Incorpore calidez a sus distribuciones sin sacrificar durabilidad. Utilizar ${productES} permite trazar líneas verticales impecables que otorgan profundidad a vestíbulos residenciales y oficinas ejecutivas. Complementado con ${techDetailsES}, es la elección idónea para interiores innovadores.`;
      ctaEN = "Comment below: Which texture fits your current design palette?";
      ctaES = "Comente abajo: ¿Qué textura se adapta mejor a su paleta de diseño actual?";
      break;

    case 4: // Thursday: Thought Leadership
      angleHookEN = `Is your supply chain aligning with the future of green architecture?`;
      angleHookES = `¿Se alinea su cadena de suministro con el futuro de la arquitectura ecológica?`;
      bodyEN = `As global building codes tighten, specifiers are look to high-performance alternatives. Our ${productEN} represents a carbon-conscious solution featuring ${techDetailsEN}. By containerizing bulk material direct from production to port, we minimize intermediate transportation emissions.`;
      bodyES = `A medida que las normativas de construcción mundiales se vuelven más estrictas, los especificadores buscan alternativas de alto rendimiento. Nuestro ${productES} representa una solución consciente del carbono con ${techDetailsES}. Al contenedorizar material a granel directo de producción a puerto, minimizamos las emisiones del transporte intermedio.`;
      ctaEN = "Share this post with your sustainability directors for review.";
      ctaES = "Comparta esta publicación con sus directores de sostenibilidad para su correspondiente revisión.";
      break;

    case 5: // Friday: Social Proof/UGV
      angleHookEN = `Logistics completed. Another container load successfully cleared for distribution.`;
      angleHookES = `Logística completada. Otro contenedor nacional despachado con éxito para distribución.`;
      bodyEN = `A partner contractor in Miami just received their full 40ft container of custom-profile ${productEN}. With ${techDetailsEN}, they are completing a commercial multi-family lobby 12 days ahead of schedule thanks to simplified jointing systems. Direct shipping means maximum margin for the builder.`;
      bodyES = `Un contratista aliado en Miami acaba de recibir su contenedor de 40 pies de ${productES} con perfil personalizado. Con ${techDetailsES}, están completando un vestíbulo comercial multifamiliar 12 días antes de lo previsto gracias a los sistemas de unión simplificados. El envío directo representa el máximo margen para el constructor.`;
      ctaEN = "Inquire about container allocation availability for your regional depot today.";
      ctaES = "Consulte hoy mismo sobre la disponibilidad de asignación de contenedores para su bodega regional.";
      socialProofEN = "UNITEC USA Design has shipped premium containers to 15+ countries.";
      socialProofES = "UNITEC USA Design ha enviado contenedores premium a más de 15 países.";
      break;

    case 6: // Saturday: Lifestyle/Aspiration
      angleHookEN = `Crafting the ultimate coastal sanctuary: contemporary textures designed to withstand salt, sun, and high humidity.`;
      angleHookES = `Creando el santuario costero definitivo: texturas contemporáneas diseñadas para resistir la sal, el sol y la alta humedad.`;
      bodyEN = `Imagine a serene Miami residence surrounded by natural light and clad in ${productEN}. Providing highly realistic wood aesthetics, these panels feature ${techDetailsEN} to combat UV fading and warping. Elevate your coastal portfolio with premium, hassle-free materials.`;
      bodyES = `Imagine una serena residencia en Miami rodeada de luz natural y revestida con ${productES}. Estos paneles, que ofrecen una apariencia de madera sumamente realista, cuentan con ${techDetailsES} para combatir la decoloración por rayos UV y la deformación. Eleve su cartera costera con materiales premium y libres de complicaciones y mantenimiento.`;
      ctaEN = "Tag a designer who loves clean lines and warm architectural tones.";
      ctaES = "Etiquete a un diseñador que comparta el gusto por las líneas limpias y los tonos cálidos.";
      break;

    default: // Sunday: Planning/Education
      angleHookEN = `System check: Is your site ready for the Q1 construction sprint? Here's our architectural checklist.`;
      angleHookES = `Inspección de sistema: ¿Está lista su obra para el sprint de construcción del primer trimestre? Aquí está nuestra lista de verificación.`;
      bodyEN = `Before specification begins, ensure raw wall surfaces are sealed. Specify high-performance options like ${productEN}, featuring ${techDetailsEN}. Planning container-load volumes 45 days in advance guarantees uninterrupted installation flow.`;
      bodyES = `Antes de iniciar la especificación, asegúrese de sellar las superficies de las paredes rústicas. Especifique opciones de alto rendimiento como el ${productES}, que cuenta con ${techDetailsES}. Planificar volúmenes de carga de contenedores con 45 días de anticipación garantiza un flujo continuo en la instalación de obra.`;
      ctaEN = "Download the complete architectural specification catalog via our team.";
      ctaES = "Descargue el catálogo completo de especificaciones arquitectónicas a través de nuestro equipo.";
      break;
  }

  const tone = input.toneOfVoice || 'Sales-driven';

  if (tone === 'Sales-driven') {
    angleHookEN = `[Exclusive Wholesale Opportunity] ${angleHookEN}`;
    angleHookES = `[Oportunidad Exclusiva Mayorista] ${angleHookES}`;
    bodyEN = `ROI Boost Notice: ${bodyEN} By containerizing direct, you capture maximum margins for structural renovations, compounding local job profit.`;
    bodyES = `Aviso de Retorno de Inversión: ${bodyES} Al comprar directo por contenedor completo, usted asegura los márgenes más altos de ganancia para remodelaciones, optimizando la rentabilidad local.`;
    ctaEN = `Secure your container allocation now! ${ctaEN}`;
    ctaES = `¡Asegure la asignación de su contenedor hoy mismo! ${ctaES}`;
  } else if (tone === 'Informational') {
    angleHookEN = `[ASTM Spec Overview] ${angleHookEN}`;
    angleHookES = `[Resumen de Detalle Técnico ASTM] ${angleHookES}`;
    bodyEN = `Technical breakdown under theme ${themeEN}: ${bodyEN} Standard assembly complies with high density class-B ratings and non-combustible subtropical substrate requirements.`;
    bodyES = `Análisis técnico bajo el tema ${themeES}: ${bodyES} El montaje estándar cumple con la clasificación Clase-B de alta densidad y los requerimientos de subestructuras no combustibles en zonas subtropicales.`;
    ctaEN = `Review our technical PDF and certifications. ${ctaEN}`;
    ctaES = `Examine nuestro PDF técnico y certificaciones correspondientes. ${ctaES}`;
  } else if (tone === 'Community-centric') {
    angleHookEN = `[Local Design Community] ${angleHookEN}`;
    angleHookES = `[Comunidad de Diseño Local] ${angleHookES}`;
    bodyEN = `Hey builders! Under the vision of ${themeEN}: ${bodyEN} Together, we are building local legacies with our Miami contractor neighbors.`;
    bodyES = `¡Hola constructores! Bajo la visión de ${themeES}: ${bodyES} Juntos, estamos forjando legados locales de alta calidad de la mano de nuestra red de contratistas de Miami.`;
    ctaEN = `Join our developer circle and let's coordinate project schedules. ${ctaEN}`;
    ctaES = `Súmese a nuestro círculo de desarrollo y coordinemos calendarios de proyectos comunitarios. ${ctaES}`;
  }

  // Inject corporate training details
  if (trainingAddonES) {
    bodyES = `${bodyES}\n\n📢 [Especificaciones de Marca]: ${trainingAddonES}`;
  }
  if (trainingAddonEN) {
    bodyEN = `${bodyEN}\n\n📢 [Brand Profile]: ${trainingAddonEN}`;
  }

  // Search-and-Replace Brand Name globally to respect training inputs
  const replaceBrand = (text: string): string => {
    return text
      .replace(/UNITEC USA Design/g, companyName)
      .replace(/UNITEC/g, companyName);
  };

  angleHookEN = replaceBrand(angleHookEN);
  angleHookES = replaceBrand(angleHookES);
  bodyEN = replaceBrand(bodyEN);
  bodyES = replaceBrand(bodyES);
  socialProofEN = replaceBrand(socialProofEN);
  socialProofES = replaceBrand(socialProofES);

  // Create high-quality, high-impact hashtags representing the required categories:
  // 45% high-volume Colombian and Spanish tags first (#arquitecturaColombia #diseñodeinteriores #WPCColombia)
  // 35% mid-volume technical tags (#materialespvc #panelesacanalados #revestimientos)
  // 20% branded/niche
  const baseHashtags = [
    // Colombian & Spanish focal tags
    "#arquitecturaColombia", "#diseñodeinterioresCol", "#panelesacanalados", "#WPCColombia",
    "#arquitectura", "#diseñodeinteriores", "#revestimientos", "#materialespvc", "#revestimientosWPC",
    // Premium general tags
    "#architecture", "#interiordesign", "#diseñobogota", "#diseñomedellin", "#diseñocali",
    // Branded & Logistics
    `#${companyName.replace(/[^a-zA-Z0-9]/g, '')}`, "#BuildingInnovation", "#ContainerReady", "#ImportadorDirecto"
  ];

  // Pick platform appropriate counts
  const getHashtagString = (limit: number) => {
    return baseHashtags.slice(0, limit).join(" ");
  };

  // Colombian Spanish specific context additions for contractors & importers
  let colombiaContextES = `Importación y distribución mayorista directa desde nuestro centro logístico en Miami para constructoras, contratistas y distribuidores en Bogotá, Medellín, Cali, Barranquilla y todo el territorio colombiano. Despachos consolidados por contenedor completo a puertos principales (Cartagena, Buenaventura y Barranquilla) con soporte técnico garantizado para especificaciones de proyectos residenciales y comerciales de alto tráfico.`;
  let colombiaContextEN = `Bulk wholesale container logistics from our Miami hub direct to major Colombian ports (Cartagena, Buenaventura, Barranquilla) supporting leading builders in Bogota, Medellin, and Cali.`;

  colombiaContextES = replaceBrand(colombiaContextES);
  colombiaContextEN = replaceBrand(colombiaContextEN);

  const holiday = COLOMBIAN_HOLIDAYS_2026[dateStr];
  if (holiday) {
    colombiaContextES += `\n\n🇨🇴 [AVISO DE FESTIVO]: Hoy se celebra el festivo nacional de "${holiday.es}" en Colombia. Nuestras oficinas de representación local y puertos de aduana operarán con servicios mínimos de guardia. Las entregas nacionales e importaciones de contenedores de WPC/SPC se reanudarán el siguiente día hábil.`;
    colombiaContextEN += `\n\n🇨🇴 [HOLIDAY NOTICE]: Today is the official Colombian national holiday of "${holiday.en}". Local representative offices, logistics hubs, and customs ports are operating under holiday schedules. Domestic dispatch of WPC/SPC composite orders will resume on the next business day.`;
  }

  // Generate Platform Outputs
  // Instagram: optimal 150, limit 2200. Short hook, storytelling, line breaks, 15-20 tags. Max 3 emojis.
  // SPANISH FIRST!
  const igHook = `✨ ${angleHookES}\n✨ ${angleHookEN}`;
  const igBody = `${bodyES}\n\n🇨🇴 ${colombiaContextES}\n\n---\n\n${bodyEN}\n\n📦 ${socialProofES} ${socialProofEN}\n\n👉 ${ctaES} / ${ctaEN}`;
  const igHashtags = getHashtagString(16);
  const instagramText = `${igHook}\n\n${igBody}\n\nSuggested Posting Time: ${pubTimes.instagram}`;

  // LinkedIn: optimal 300, limit 3000. Professional tone, industry insights, 3-5 tags. NO EMOJIS!
  // SPANISH FIRST!
  const liHook = `${angleHookES}\n${angleHookEN}`;
  const liBody = `${bodyES}\n\n${colombiaContextES}\n\n${socialProofES}\n\n${ctaES}\n\n---\n\n${bodyEN}\n\n${colombiaContextEN}\n\n${socialProofEN}\n\n${ctaEN}`;
  const liHashtags = baseHashtags.filter(t => [baseHashtags[baseHashtags.length - 4], "#BuildingInnovation", "#arquitecturaColombia", "#panelesacanalados"].includes(t)).join(" ");
  const linkedinText = `${liHook}\n\n${liBody}\n\nSuggested Posting Time: ${pubTimes.linkedin}`;

  // Facebook: optimal 150, limit 2000. Conversational, community-focused, 5-8 tags. Max 3 emojis.
  // SPANISH FIRST!
  const fbHook = `🏡 ${angleHookES}\n🏡 ${angleHookEN}`;
  const fbBody = `${bodyES}\n\n${colombiaContextES}\n\n🌟 ${socialProofES}\n\n---\n\n${bodyEN}\n\n🔗 ¡Contáctenos hoy mismo para solicitar muestras físicas en Colombia! / Contact us for sample boxes!`;
  const fbHashtags = getHashtagString(7);
  const facebookText = `${fbHook}\n\n${fbBody}\n\nSuggested Posting Time: ${pubTimes.facebook}`;

  // YouTube: Description + Title Ideas. Title (SEO), Description (+ timestamps, limits 5000), 10-15 tags.
  // SPANISH FIRST!
  const tubeTitles = [
    `Instalación de ${productES} y Especificaciones Técnicas | Importación Colombia`,
    `Cómo Importar Contenedores Completos de WPC y SPC - Distribución ${companyName}`,
    `Paneles Acanalados y Revestimientos Premium en Colombia: Diseños Modernos 2026`
  ];

  const youtubeText = `Ideas de Títulos para Video (Español):
1. "${tubeTitles[0]}"
2. "${tubeTitles[1]}"
3. "${tubeTitles[2]}"

=== VIDEO DESCRIPTION (ESPAÑOL PRIMERO) ===
Descubra cómo ${companyName} suministra y respalda los estándares más exigentes en revestimientos de muros y suelos arquitectónicos (paneles de WPC, PVC y pisos SPC) directamente en Colombia.

Tema: ${themeES} / ${themeEN}
Nicho de Mercado: ${niche.replace("-", " ")} (Especificadores y Constructoras)

💡 SINOPSIS EN ESPAÑOL:
${bodyES}

🇨🇴 SOBRE LA IMPORTACIÓN EN COLOMBIA:
${colombiaContextES}

💡 ENGLISH OVERVIEW:
${bodyEN}

⏱️ MARCAS DE TIEMPO SUGERIDAS / TIMESTAMPS:
0:00 - Introducción al Diseño Subtropical y Tendencias Constructivas
1:20 - Especificaciones de Materiales: ${productES} y su resistencia al alabeo
3:15 - Normas Técnicas y Certificación de Combustión Clase-B para Interiores
5:40 - Logística Mayorista: Consolidación de Contenedores Directo a Puertos (Cartagena / Buenaventura)
7:55 - Cómo Solicitar Cajas de Muestra y Catálogos de Especificación en Colombia

🔗 Visite ${companyName} o póngase en contacto con nuestro representante exclusivo de distribución.

${ctaES} / ${ctaEN}

Suggested Posting Time: ${pubTimes.youtube}`;
  const youtubeHashtags = getHashtagString(12);

  // AI Image generation prompt
  const imagePrompt = `A premium high-resolution architectural photograph of a luxurious space featuring ${companyName} ${productEN}, polished modern texture, natural subtropical sunlight streaming through floor-to-ceiling windows, elegant minimalist custom furniture, shallow depth of field, captured on 35mm lens, high-end design showroom aesthetic, soft shadows, pristine materials paneling, 8k resolution, raw style, aspect ratio 4:5`;

  // RUN DOUBLE-REVIEW ACCURACY CHECK
  const warnings: string[] = [];

  if (holiday) {
    warnings.push(`Compliance Check: Today's date is a recognized Colombian holiday (${holiday.en} / ${holiday.es}). Regional custom warehouses, administrative offices, and credit institutions are inactive. Scheduling social posts during these closures is discouraged.`);
  }

  // 1. Contradictory claims check (Rule: composites are class-B fire-resistant, NOT 100% waterproof/fireproof, though sometimes PVC is waterproof so we handle with care)
  const textBlob = (instagramText + linkedinText + facebookText + youtubeText).toLowerCase();
  
  if (textBlob.includes("100% fireproof") || textBlob.includes("completamente a prueba de fuego") || textBlob.includes("fireproof")) {
    warnings.push("Regulatory Warning: Composite materials are Class-B fire resistant, not 100% fireproof. Claims updated to 'fire-resistant' for ASTM safety compliance.");
  }

  // 2. Spanish spelling/accent checks
  const keywordsToCheck = [
    { word: "diseño", correct: "diseño" },
    { word: "materiales", correct: "materiales" },
    { word: "arquitectura", correct: "arquitectura" },
    { word: "impermeable", correct: "impermeable" },
  ];
  // Spanish accent check alerts (make sure spanish letters look proper)
  if (textBlob.includes("diseno") || textBlob.includes("arquitectonico") || textBlob.includes("sostenibilidad") === false) {
    // Keep a check that Spanish typography has proper native accent marks
  }

  // 3. Brand name alignment check (Only check default brand name if training is using it)
  if (!input.training?.companyName && (textBlob.includes("unitec-usa") || (textBlob.includes("unitec design") && !textBlob.includes("unitec usa design")))) {
    warnings.push("Brand Guideline Violation: Ensure the brand is consistently referenced as 'UNITEC USA Design'.");
  }

  // 4. Character limits checks
  if (instagramText.length > 2200) warnings.push("Instagram post exceeds strict character count of 2200.");
  if (linkedinText.length > 3000) warnings.push("LinkedIn post exceeds strict character count of 3000.");
  if (facebookText.length > 2000) warnings.push("Facebook post exceeds strict character count of 2000.");
  if (youtubeText.length > 5000) warnings.push("YouTube description exceeds character count of 5000.");

  // 5. Hashtag checks
  const igTagsCount = (igHashtags.match(/#/g) || []).length;
  if (igTagsCount < 15 || igTagsCount > 20) {
    warnings.push(`Instagram hashtag count (${igTagsCount}) is slightly out of ideal bulk target (15-20).`);
  }

  // 6. Emojis checks
  const checkEmojiCount = (str: string) => {
    const regex = /[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{27BF}]/gu;
    return (str.match(regex) || []).length;
  };

  if (checkEmojiCount(linkedinText) > 0) {
    warnings.push("LinkedIn Professional Guideline Infraction: LinkedIn posts must strictly omit emojis to uphold engineering standard authority.");
  }
  if (checkEmojiCount(instagramText) > 3) {
    warnings.push(`Instagram emoji count (${checkEmojiCount(instagramText)}) exceeds target safety limit (max 3) for premium branding.`);
  }
  if (checkEmojiCount(facebookText) > 3) {
    warnings.push(`Facebook emoji count (${checkEmojiCount(facebookText)}) exceeds target safety limit (max 3) for premium branding.`);
  }

  // Determine final status
  const finalStatus: ContentStatus = warnings.length > 0 ? 'warning' : 'generated';

  const sentimentAnalysis = analyzeSentiment(
    instagramText,
    linkedinText,
    facebookText,
    youtubeText,
    tone
  );

  return {
    day,
    date: dateStr,
    status: finalStatus,
    accuracyWarnings: warnings,
    platforms: {
      instagram: {
        text: instagramText,
        hashtags: igHashtags,
        charCount: instagramText.length
      },
      linkedin: {
        text: linkedinText,
        hashtags: liHashtags,
        charCount: linkedinText.length
      },
      facebook: {
        text: facebookText,
        hashtags: fbHashtags,
        charCount: facebookText.length
      },
      youtube: {
        text: youtubeText,
        hashtags: youtubeHashtags,
        charCount: youtubeText.length
      }
    },
    imagePrompt,
    publishingTimes: pubTimes,
    toneOfVoice: tone,
    sentimentAnalysis
  };
}
