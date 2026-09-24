/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { promptRefiner, ARCHITECTURAL_TEMPLATES } from './src/services/promptRefiner.ts';

// Lazy-initialized Gemini client following development guidelines
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const rawKey = process.env.GEMINI_API_KEY;
  if (!rawKey || !rawKey.trim()) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  const key = rawKey.trim().replace(/^["']|["']$/g, '');
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

async function startServer() {
  const app = express();
  const args = process.argv.slice(2);
  const portArgIndex = args.indexOf('--port');
  const isDevelopment = process.env.NODE_ENV === 'development';
  const candidateDirs = [
    path.join(process.cwd(), 'dist'),
    process.cwd()
  ];
  let distPath = path.join(process.cwd(), 'dist');
  for (const dir of candidateDirs) {
    if (fs.existsSync(path.join(dir, 'index.html'))) {
      distPath = dir;
      break;
    }
  }
  const indexPath = path.join(distPath, 'index.html');
  const hasDist = fs.existsSync(indexPath);

  const PORT = portArgIndex !== -1 && args[portArgIndex + 1]
    ? parseInt(args[portArgIndex + 1], 10)
    : parseInt(process.env.PORT || '3000', 10);

  // JSON request parsing support
  app.use(express.json());

  // API Health Check Route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Gemini API Key Diagnostic & Verification Route
  app.get('/api/gemini/status', async (req, res) => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(200).json({
        configured: false,
        working: false,
        status: 'MISSING_KEY',
        message: 'No GEMINI_API_KEY environment variable is configured.'
      });
    }

    try {
      const ai = getGeminiClient();
      const testResponse = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: 'Test connection. Respond with OK.'
      });

      return res.status(200).json({
        configured: true,
        working: true,
        status: 'ACTIVE',
        model: 'gemini-3.7-flash',
        sampleResponse: testResponse.text?.trim() || 'OK',
        message: 'Gemini API key is active and working properly.'
      });
    } catch (err: any) {
      const rawError = err?.message || String(err);
      let status = 'ERROR';
      let friendlyMessage = 'Error connecting to Gemini API.';

      if (rawError.includes('CONSUMER_SUSPENDED') || rawError.includes('suspended')) {
        status = 'SUSPENDED';
        friendlyMessage = 'The Google Cloud project or Gemini API key is suspended. You need to generate a new active API key in Google AI Studio (https://aistudio.google.com/app/apikey) or update your billing/project state.';
      } else if (rawError.includes('API_KEY_INVALID') || rawError.includes('invalid')) {
        status = 'INVALID_KEY';
        friendlyMessage = 'The GEMINI_API_KEY is invalid or mistyped. Please obtain a fresh key from Google AI Studio.';
      } else if (rawError.includes('RESOURCE_EXHAUSTED') || rawError.includes('quota')) {
        status = 'QUOTA_EXCEEDED';
        friendlyMessage = 'Gemini API quota exceeded or rate limit reached.';
      }

      return res.status(200).json({
        configured: true,
        working: false,
        status,
        message: friendlyMessage,
        details: rawError
      });
    }
  });

  // Architectural Photography Prompt Refiner Service: List Templates
  app.get('/api/prompt-refiner/templates', (req, res) => {
    res.json({
      success: true,
      count: ARCHITECTURAL_TEMPLATES.length,
      templates: ARCHITECTURAL_TEMPLATES
    });
  });

  // Architectural Photography Prompt Refiner Service: On-demand Refinement
  app.post('/api/prompt-refiner/refine', async (req, res) => {
    try {
      const {
        prompt = '',
        templateId,
        aspectRatio = '1:1',
        style = 'Comercial & Producto 8K',
        referenceImage,
        referenceEmailText = '',
        customOverrides
      } = req.body;

      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ success: false, error: 'Prompt es requerido para refinar.' });
      }

      let ai = null;
      try {
        ai = getGeminiClient();
      } catch (keyErr) {
        // Fallback to deterministic synthesis if API key not present
      }

      const result = await promptRefiner.refinePromptWithArchitecturalTemplates({
        rawPrompt: prompt.trim(),
        templateId,
        aspectRatio,
        style,
        referenceImage,
        referenceEmailText,
        customOverrides
      }, ai || undefined);

      return res.json({
        success: true,
        ...result
      });
    } catch (err: any) {
      console.error('Prompt Refiner API error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Error en el servicio de refinamiento arquitectónico'
      });
    }
  });

  // Multichannel & CRM AI Repurposer Bundle (Strictly Google Gemini 3.7)
  app.post('/api/gemini/generate-multiplatform-bundle', async (req, res) => {
    try {
      const {
        product = 'Campaña UNITEC',
        audience = '',
        objective = '',
        offer = '',
        contextText = '',
        tone = 'Sales-driven',
        whatsappNumber = '13055550199',
        utmCampaign = 'campana_unitec'
      } = req.body;

      const systemInstruction = `You are a chief growth marketing officer, creative director, and omnichannel campaign strategist for high-end B2B & B2C brands.
Your task is to take a product briefing and generate a complete MASTER CAMPAIGN JSON bundle in a cascade flow.

You MUST return a JSON object exactly matching this schema:
{
  "masterStrategy": { "keywords": ["..."], "targetInsight": "..." },
  "facebook": { "post": "...", "hashtags": "...", "smartPostingTime": "...", "imageIdea": "..." },
  "instagram": { "caption": "...", "hashtags": "...", "smartPostingTime": "...", "imageIdea": "..." },
  "youtube": { "title": "...", "description": "...", "tags": "...", "smartPostingTime": "...", "videoIdea": "..." },
  "linkedin": { "headline": "...", "articlePost": "...", "smartPostingTime": "..." },
  "tiktok": { "hook0to3s": "...", "sceneScript": "Elaborated video instruction...", "smartPostingTime": "..." },
  "email": { "subject": "...", "body": "..." },
  "analytics": { 
     "expectedReach": 15000, 
     "targetEngagementRate": 4.5, 
     "crmExpectedLeads": 120 
  },
  "calendar": [ { "day": 1, "platform": "...", "content": "..." } ]
}

CRITICAL CREATIVE UPGRADES - FULL MARKETING WORKFLOW:
- "imageIdea" MUST be a hyper-detailed, extremely creative, photorealistic commercial prompt for AI image generation (Imagen 3 / Midjourney / FLUX). Include exact materials, studio lighting (3-point softbox, rim light), camera optics (85mm f/2.8 lens), colors, and composition with safe zones for social media.
- "sceneScript" (for TikTok) and "videoIdea" (for YouTube) MUST be highly creative, full video production workflows. Structure it as a professional shot list (e.g., [0:00-0:03 HOOK] Visual + Audio, [0:03-0:10 BUILDUP]). Include specific instructions for camera movement (60fps dolly in, orbital pan), lighting, sound effects (SFX), B-roll, on-screen text, and emotional pacing. Do not just write a script; design the full video workflow.
- Provide a smartPostingTime (e.g., "Martes 10:00 AM EST") for every platform.
Language: Output strictly in Spanish.`;

      const prompt = `Adapt the following briefing into all formats:
- Product/Service: "${product}"
- Target Audience: "${audience}"
- Main Objective: "${objective}"
- Special Offer/Hook: "${offer}"
- Additional Context: "${contextText}"
- Tone of Voice: "${tone}"
- WhatsApp Contact: "${whatsappNumber}"
- UTM Campaign Identifier: "${utmCampaign}"`;

      let variantsData = null;
      try {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
            responseMimeType: 'application/json'
          }
        });

        if (response.text) {
          variantsData = JSON.parse(response.text);
        }
      } catch (geminiError: any) {
        console.warn('Gemini Multiplatform Bundle API notice (using fallback JSON synthesis):', geminiError.message || geminiError);
      }

      if (!variantsData) {
        variantsData = {
          masterStrategy: {
            keywords: ['#innovacion', '#diseño', '#arquitectura'],
            targetInsight: 'Arquitectos y constructores buscan reducción de costos sin perder calidad estética.'
          },
          instagram: {
            hook: `🔥 ${product}: Elegancia y diseño sin límites.`,
            caption: `¿Buscando acabados que eleven tus proyectos? ✨\n\n✔️ 100% Resistente\n✔️ Acabados de lujo\n\n💬 Escríbenos por DM.`,
            hashtags: '#UnitecDesign #Arquitectura',
            visualDirection: 'Carrusel de texturas en primer plano'
          },
          linkedin: {
            headline: `Innovación en materiales arquitectónicos para ROI en desarrollos.`,
            articlePost: `En la industria del diseño, la diferenciación es clave.\n\nTres aprendizajes clave:\n1. Durabilidad.\n2. Sostenibilidad.\n3. Acabados estéticos.`,
            takeaways: ['Optimización de costos', 'Resistencia', 'Soporte técnico'],
            callToAction: 'Conecta con nuestro equipo para muestras físicas.'
          },
          tiktokReels: {
            hook0to3s: `"Si estás remodelando, cometerás un error si no usas esto..."`,
            sceneScript: `[0:00 - 0:03] Cámara tocando la textura.\n[0:03 - 0:10] Paneo rápido.\n[0:10 - 0:15] CTA.`,
            onScreenText: `👀 EL SECRETO REVELADO`,
            audioTrendSuggestion: 'Audio rítmico corporativo'
          },
          emailNewsletter: {
            subjectLines: [`⚡ [Exclusivo] ${product}`, `Mira la diferencia ✨`, `Catálogo exclusivo`],
            previewSnippet: `Descubre los acabados de alta gama en Miami.`,
            emailBody: `Hola [Nombre],\n\nPresentamos: **${product}**.\n\nHaz clic para hablar con un asesor.`,
            buttonCta: 'Descargar Catálogo'
          },
          metaAds: {
            primaryTextVariations: [`¿Buscas proveedores en Florida? Ofrecemos materiales de vanguardia.`, `Transforma tus desarrollos con acabados de lujo.`],
            headlineVariations: ['Acabados de Lujo', 'Eleva el Valor', 'Catálogo Exclusivo'],
            leadFormCta: 'Solicitar Muestra'
          },
          crmLeadMagnet: {
            suggestedLeadMagnet: `Guía de Tendencias 2026: ${product}`,
            whatsappDirectUrl: `https://wa.me/${whatsappNumber}?text=Info`,
            hubspotUtmLink: `https://unitecdesign.com/catalogo?utm_source=social&utm_medium=gemini`
          },
          calendar: [
            { day: 1, platform: 'Email', content: 'Lanzamiento de teaser' },
            { day: 2, platform: 'Instagram', content: 'Carrusel visual de texturas' },
            { day: 3, platform: 'LinkedIn', content: 'Artículo sobre ROI' }
          ]
        };
      }

      return res.json({
        success: true,
        variants: variantsData
      });
    } catch (err: any) {
      console.error('Error generating multiplatform variants:', err);
      return res.status(500).json({ success: false, error: err.message || 'Error processing multiplatform request' });
    }
  });

  // Endpoint to expand and enhance image and video prompts with AI (Social Media & High Quality Optimized)
  app.post('/api/gemini/enhance-prompt', async (req, res) => {
    try {
      const { 
        prompt, 
        type = 'image', 
        platform = 'Instagram & TikTok', 
        style = 'Comercial & Producto 8K', 
        aspectRatio = '1:1',
        context = '',
        referenceImage,
        referenceEmailText = ''
      } = req.body;

      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ success: false, error: 'Se requiere un texto o idea para mejorar.' });
      }

      const ai = getGeminiClient();
      const contentParts: any[] = [];

      if (referenceImage && typeof referenceImage === 'string') {
        let mimeType = 'image/png';
        let base64Data = referenceImage;
        if (referenceImage.includes(';base64,')) {
          const splitData = referenceImage.split(';base64,');
          mimeType = splitData[0].replace('data:', '') || 'image/png';
          base64Data = splitData[1];
        }
        contentParts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      }

      const promptOptimizerInstruction = `You are a world-class advertising creative director, cinematographer, and AI prompt engineer for luxury and commercial brands (Imagen 3, FLUX.1, Midjourney v6, Google Veo).
Your task is to take the user's raw text and transform it into an ultra-high-definition, photorealistic marketing prompt specifically engineered to maximize visual quality and perform on modern social media algorithms.

User raw prompt: "${prompt}"
Medium type: "${type}" (image or video)
Target platform: "${platform}"
Aspect ratio: "${aspectRatio}"
Style preset: "${style}"
Additional context / Reference email: "${referenceEmailText || context || 'none'}"

SOCIAL MEDIA & VISUAL REQUISITES TO ENFORCE:
1. FIDELITY TO REFERENCE:
   - If a visual reference image is provided, carefully inspect the product geometry, silhouette, surface materials (brushed metal, marble, oak wood, acrylic, glass), color palette, and brand markers. Explicitly lock these physical details into the prompt so the generated output matches the reference.
   - If reference email/notes are provided, extract key marketing claims, audience hooks, and brand tone.
2. SAFE ZONES: 
   - If 9:16 (Stories/Reels/TikTok/Shorts): Keep focal subjects inside the middle 65% vertical safety zone so app UI buttons and captions never block the product.
   - If 1:1 (Feed): Center-weighted or golden-ratio commercial symmetry, optimized for quick scroll-stopping mobile contrast.
   - If 16:9 (YouTube/Banner): Editorial wide-angle cinematic depth, rule of thirds, clean negative space for potential headline typography.
3. PHOTOGRAPHIC FIDELITY (for image):
   - Specific camera & optics: Medium-format Hasselblad H6D-100c or Phase One look, 85mm f/2.8 lens, ultra-sharp center focus, creamy natural bokeh.
   - High-end studio lighting: Diffused 5600K softbox key light, soft ambient fill, subtle rim/kicker light separating subject from background, micro-reflections without blown-out specular highlights.
   - Authentic materials: Realistic micro-textures, tactile finishes, no plastic or deformed geometry.
4. MOTION & CINEMATOGRAPHY (for video):
   - 60fps smooth cinematic gimbal dolly push-in, subtle orbital 360 rotation, slow-motion reveal, atmospheric volumetric lighting.

OUTPUT STRICTLY AS VALID JSON:
{
  "enhancedSpanish": "Desglose visual creativo en español con dirección de arte, iluminación y plano para el equipo de marketing.",
  "masterEnglish": "Ultra-detailed, crisp English diffusion/Veo prompt (100-140 words) with camera, lens, lighting, materials, resolution and composition cues.",
  "socialMediaSpecs": {
    "safeZoneTip": "Regla de zona segura para esta plataforma...",
    "compositionRule": "Composición recomendada...",
    "visualHook": "Gancho visual clave...",
    "idealResolution": "Ultra HD 2K (1080p/2048px)"
  },
  "tags": ["Iluminación Softbox 3-Puntos", "Lente 85mm f/2.8", "Zona Segura Redes", "Detalle Fotorrealista 8K"]
}`;

      contentParts.push({
        text: `Optimize this prompt for ${type} in aspect ratio ${aspectRatio} on platform ${platform} with style "${style}".
User idea: "${prompt}".
${referenceEmailText ? `Business context from email/brief: "${referenceEmailText}".` : ''}
${referenceImage ? 'A visual reference image is attached above. Lock its product geometry, materials, and colors into the master prompt with maximum fidelity.' : ''}`
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts: contentParts },
        config: {
          systemInstruction: promptOptimizerInstruction,
          responseMimeType: 'application/json',
          temperature: 0.5
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({
          success: true,
          enhancedPrompt: parsed.enhancedSpanish || prompt,
          masterEnglish: parsed.masterEnglish || prompt,
          socialMediaSpecs: parsed.socialMediaSpecs || {
            safeZoneTip: 'Sujeto centrado con margen del 15% para evitar recortes de interfaz.',
            compositionRule: 'Composición comercial de alto contraste.',
            visualHook: 'Foco nítido en el producto principal.',
            idealResolution: '2K Ultra HD'
          },
          tags: parsed.tags || ['Calidad Comercial 8K', 'Optimizado para Redes']
        });
      }
    } catch (err: any) {
      console.warn('AI prompt enhance fallback:', err.message);
    }

    // Fallback if API fails
    return res.json({
      success: true,
      enhancedPrompt: `${req.body.prompt}. Fotografía publicitaria fotorrealista 8K, iluminación de estudio profesional softbox difusa, acabado de alta fidelidad, texturas hiperrealistas, composición equilibrada con zona segura para redes sociales.`,
      masterEnglish: `${req.body.prompt}, ultra-photorealistic commercial product photography, 8k resolution, professional 3-point softbox studio lighting, 85mm lens f/2.8, Hasselblad medium format color science, razor sharp focus, premium marketing editorial look`,
      socialMediaSpecs: {
        safeZoneTip: 'Mantén el producto en el tercio central para que los botones de Instagram/TikTok no lo cubran.',
        compositionRule: 'Composición centrada con fondo suavemente desenfocado.',
        visualHook: 'Reflejos y texturas nítidas en los primeros 3 segundos.',
        idealResolution: '2K Ultra HD'
      },
      tags: ['Calidad Comercial 8K', 'Optimizado para Redes', 'Iluminación Pro']
    });
  });

  // Deep Prompt Assistant for High Fidelity (ChatGPT & Gemini Pro level with visual & email inspection)
  app.post('/api/gemini/assist-prompt-fidelity', async (req, res) => {
    try {
      const { 
        prompt = '', 
        type = 'image', 
        referenceImage, 
        referenceEmailText = '', 
        aspectRatio = '1:1', 
        style = 'Comercial & Producto 8K', 
        platform = 'Instagram & TikTok' 
      } = req.body;

      const ai = getGeminiClient();
      const promptParts: any[] = [];
      let hasRefImage = false;

      if (referenceImage && typeof referenceImage === 'string') {
        let mimeType = 'image/png';
        let base64Data = referenceImage;
        if (referenceImage.includes(';base64,')) {
          const splitData = referenceImage.split(';base64,');
          mimeType = splitData[0].replace('data:', '') || 'image/png';
          base64Data = splitData[1];
        }
        promptParts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
        hasRefImage = true;
      }

      const assistantInstruction = `You are a world-class Visual Director, Luxury Brand Creative Director, and Prompt Architect (operating at the level of the latest ChatGPT and Gemini Pro prompt engineering models).
Your mission is to analyze the user's creative concept, the attached visual reference image (if provided), and the reference email/briefing context (if provided), to craft an authoritative, hyper-fidelity diffusion/video prompt and creative direction.

Input Parameters:
- Content Type: ${type === 'video' ? 'Video Generation (Google Veo / Cinematic Motion)' : 'Photographic Asset Generation (Google Gemini Imagen 3 / 2K)'}
- Target Aspect Ratio: ${aspectRatio}
- Target Platform: ${platform}
- Visual Style: ${style}
- User's Concept/Idea: "${prompt}"
- Reference Email / Business Context: "${referenceEmailText || 'None provided'}"
- Visual Reference Image Attached: ${hasRefImage ? 'YES (Inspect the attached image closely for product identity, geometry, materials, finish, and color palette)' : 'NO (Create from concept)'}

Tasks:
1. Reference Analysis & DNA Extraction:
   - Identify the exact physical subject from the reference image/email (geometry, proportions, branding, silhouette).
   - Identify the micro-surface materials (e.g. brushed matte metal, veined Carrara marble, fluted walnut wood, semi-gloss acrylic, woven linen).
   - Extract the color DNA and lighting style.
   - Extract key marketing claims and audience hooks from the reference email/context.

2. Master English Prompt (The exact prompt to feed into Imagen 3 / Veo):
   - For Images:
     Must follow state-of-the-art diffusion prompt standards:
     [Subject & Reference Geometry Lock] + [Surrounding Environment & Staging] + [Materiality & Micro-Textures] + [3-Point Studio Lighting: Key 5600K diffused softbox, rim light, ambient fill] + [Optics: Hasselblad medium format look, 85mm f/2.8 lens, razor-sharp focus] + [Social Safe-Zone Composition: Centered with margins suitable for ${aspectRatio}].
   - For Video:
     Must follow Veo cinematic motion standards:
     [Anchor Frame 0:00: Locked to reference product appearance] + [Smooth 60fps Camera Dynamic: Orbital gimbal pan, slow macro push-in, or tracking crane] + [Dynamic Lighting & Specular Highlights sweeping across surface] + [Pacing & Atmosphere] + [Framed with safe margins for ${platform}].

3. Return JSON with this structure:
{
  "referenceAnalysis": {
    "detectedSubject": "...",
    "detectedMaterials": ["...", "..."],
    "colorPalette": ["#HEX or name", "..."],
    "emailKeyDirectives": "...",
    "fidelityScore": "98% Product Match"
  },
  "masterEnglish": "...",
  "enhancedSpanish": "...",
  "cinematography": {
    "cameraMovement": "...",
    "lightingScheme": "...",
    "framePacing": "..."
  },
  "socialMediaSpecs": {
    "safeZoneTip": "...",
    "compositionRule": "...",
    "visualHook": "...",
    "idealResolution": "${type === 'video' ? '1080p Full HD' : '2K Ultra HD'}"
  },
  "suggestedTags": ["...", "..."]
}`;

      promptParts.push({ text: assistantInstruction });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts: promptParts },
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({
          success: true,
          ...parsed
        });
      }

      throw new Error('No response from AI prompt assistant');
    } catch (err: any) {
      console.error('Prompt fidelity assistant error:', err);
      res.status(500).json({ success: false, error: err.message || 'Error asistiendo el prompt' });
    }
  });

  // Backward compatibility route for enhance-image-prompt
  app.post('/api/gemini/enhance-image-prompt', async (req, res) => {
    try {
      const { prompt, style = 'Comercial & Producto 8K', aspectRatio = '1:1', context = '' } = req.body;
      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ success: false, error: 'Se requiere un prompt para mejorar.' });
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are an elite creative director and AI prompt engineer for high-end brands.
Transform this user prompt into a high-end commercial marketing image prompt:
Prompt: "${prompt}"
Style: "${style}"
Aspect ratio: "${aspectRatio}"
Context: "${context}"

Enforce social media requisites: centered safe zone composition, clean negative space, 3-point studio lighting, 85mm lens, 8K photorealistic textures.
Return JSON:
{
  "enhancedSpanish": "...",
  "masterEnglish": "...",
  "socialMediaSpecs": {
    "safeZoneTip": "...",
    "compositionRule": "...",
    "visualHook": "...",
    "idealResolution": "2K Ultra HD"
  },
  "tags": ["Iluminación Softbox", "Lente 85mm", "Texturas 8K"]
}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({
          success: true,
          enhancedPrompt: parsed.enhancedSpanish || prompt,
          masterEnglish: parsed.masterEnglish || prompt,
          socialMediaSpecs: parsed.socialMediaSpecs,
          tags: parsed.tags
        });
      }
    } catch (err: any) {
      console.warn('Fallback enhance-image-prompt:', err.message);
    }

    return res.json({
      success: true,
      enhancedPrompt: `${req.body.prompt}. Fotografía fotorrealista 8K, iluminación de estudio profesional softbox, composición centrada con zona segura para redes sociales.`,
      masterEnglish: `${req.body.prompt}, photorealistic 8k, professional studio softbox lighting, ultra-sharp focus, detailed textures, architectural commercial photography style`,
      socialMediaSpecs: {
        safeZoneTip: 'Sujeto centrado para evitar recortes en feed móvil.',
        compositionRule: 'Equilibrio simétrico y contraste limpio.',
        visualHook: 'Alto impacto visual en el primer scroll.',
        idealResolution: '2K Ultra HD'
      },
      tags: ['8K Comercial', 'Zona Segura Redes']
    });
  });

  // Independent Video Script Generation Endpoint (Optimized for Social Formats)
  app.post('/api/gemini/generate-video-script', async (req, res) => {
    try {
      const { prompt, platform = 'TikTok & Instagram Reels', referenceImageDescription = '' } = req.body;
      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt es requerido.' });
      }

      const ai = getGeminiClient();
      const systemInstruction = `You are an elite creative director and video producer specialized in viral high-performance commercial video for ${platform}.
Your task is to take the user's prompt and optional visual reference, and generate a hyper-creative, production-ready video workflow and shot list.

SOCIAL MEDIA VIDEO REQUIREMENTS:
1. THE 3-SECOND HOOK: First scene must feature an irresistible visual movement, dynamic angle, or problem/curiosity hook to prevent scrolling.
2. VERTICAL / HORIZONTAL COMPOSITION & SAFE ZONES: Ensure text, actors, and product remain within the central 60% safe area away from platform UI icons and captions.
3. PACING & MOTION: Specify camera movement (slow 60fps orbital dolly, whip pan, macro rack focus, drone push-in).
4. LIGHTING & COLOR: Cinematic color grading (warm luxury, teal and amber, natural softbox).
5. SOUND & AUDIO DESIGN: Exact sound effects (SFX swooshes, ambient bass risers, rhythmic beat drops).
6. READY-TO-USE VEO / RUNWAY / SORA PROMPT: An exact English prompt ready to be pasted into AI video generators.
${referenceImageDescription ? `Visual Reference context to maintain: ${referenceImageDescription}` : ''}
Language: Output strictly in Spanish.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      return res.status(200).json({
        success: true,
        script: response.text
      });
    } catch (err: any) {
      console.error('Video Script API error:', err);
      return res.status(500).json({ 
         success: false, 
         error: err.message || 'Error processing video script request' 
       });
    }
  });

  // Google Gemini & AI Image Generation Endpoint (High-Fidelity 2K/1K with Reference Image & Social Optimization)
  app.post('/api/gemini/generate-image', async (req, res) => {
    try {
      const { 
        prompt, 
        aspectRatio = '1:1', 
        style = 'Comercial & Producto 8K', 
        referenceImage,
        referenceEmailText = '',
        resolution = '2K',
        architecturalTemplateId,
        architecturalOverrides
      } = req.body;

      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ success: false, error: 'Se requiere una descripción (prompt) para generar la imagen.' });
      }

      const validAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
      const finalRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';

      // Step 1: Prompt Refiner Service intercepts raw visual request and enhances it
      // using the library of professional architectural photography prompt templates
      // (specifying lighting, lens focal length, camera settings, and material texture settings)
      let refinerResult;
      try {
        const ai = getGeminiClient();
        refinerResult = await promptRefiner.refinePromptWithArchitecturalTemplates({
          rawPrompt: prompt.trim(),
          templateId: architecturalTemplateId,
          aspectRatio: finalRatio,
          style,
          referenceImage,
          referenceEmailText,
          customOverrides: architecturalOverrides
        }, ai);
      } catch (refineErr) {
        refinerResult = await promptRefiner.refinePromptWithArchitecturalTemplates({
          rawPrompt: prompt.trim(),
          templateId: architecturalTemplateId,
          aspectRatio: finalRatio,
          style,
          referenceImage,
          referenceEmailText,
          customOverrides: architecturalOverrides
        });
      }

      const englishDiffusionPrompt = refinerResult.refinedEnglishPrompt;

      // Prepare contents parts
      const contentParts: any[] = [];

      // If reference image provided, attach as inlineData
      if (referenceImage && typeof referenceImage === 'string') {
        let mimeType = 'image/png';
        let base64Data = referenceImage;
        if (referenceImage.includes(';base64,')) {
          const splitData = referenceImage.split(';base64,');
          mimeType = splitData[0].replace('data:', '') || 'image/png';
          base64Data = splitData[1];
        }
        contentParts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      }

      contentParts.push({ text: englishDiffusionPrompt });

      // Step 2: Google Gemini Image Generation (Attempt 2K HQ Resolution First)
      const ai = getGeminiClient();
      let foundImageUrl = '';
      let usedModel = 'gemini-3.1-flash-image';
      const targetSize = resolution === '1K' ? '1K' : '2K';

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image',
          contents: {
            parts: contentParts
          },
          config: {
            imageConfig: {
              aspectRatio: finalRatio as any,
              imageSize: targetSize as any
            }
          }
        });

        if (response.candidates && response.candidates[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              const mime = part.inlineData.mimeType || 'image/png';
              foundImageUrl = `data:${mime};base64,${part.inlineData.data}`;
              break;
            }
          }
        }
      } catch (geminiError: any) {
        console.warn(`Attempting fallback from ${targetSize} to 1K / gemini-3.1-flash-lite-image:`, geminiError.message);
        try {
          // Retry with 1K if 2K failed
          const retryRes = await ai.models.generateContent({
            model: 'gemini-3.1-flash-image',
            contents: { parts: contentParts },
            config: {
              imageConfig: {
                aspectRatio: finalRatio as any,
                imageSize: '1K'
              }
            }
          });
          if (retryRes.candidates && retryRes.candidates[0]?.content?.parts) {
            for (const part of retryRes.candidates[0].content.parts) {
              if (part.inlineData && part.inlineData.data) {
                const mime = part.inlineData.mimeType || 'image/png';
                foundImageUrl = `data:${mime};base64,${part.inlineData.data}`;
                break;
              }
            }
          }
        } catch (retryError: any) {
          console.warn('Attempting final fallback to gemini-3.1-flash-lite-image:', retryError.message);
          usedModel = 'gemini-3.1-flash-lite-image';
          const fallbackRes = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-image',
            contents: { parts: contentParts },
            config: {
              imageConfig: {
                aspectRatio: finalRatio as any
              }
            }
          });
          if (fallbackRes.candidates && fallbackRes.candidates[0]?.content?.parts) {
            for (const part of fallbackRes.candidates[0].content.parts) {
              if (part.inlineData && part.inlineData.data) {
                const mime = part.inlineData.mimeType || 'image/png';
                foundImageUrl = `data:${mime};base64,${part.inlineData.data}`;
                break;
              }
            }
          }
        }
      }

      if (foundImageUrl) {
        return res.json({ 
          success: true, 
          imageUrl: foundImageUrl,
          model: usedModel,
          appliedPrompt: englishDiffusionPrompt,
          refinedPrompt: refinerResult?.refinedSpanishPrompt,
          architecturalSpecs: refinerResult?.architecturalSpecs,
          templateUsed: refinerResult?.templateUsed,
          promptRefinerActive: true,
          hasReference: !!referenceImage,
          aspectRatio: finalRatio,
          resolution: targetSize,
          notice: `Imagen generada en Alta Calidad (${targetSize}) con el servicio Prompt Refiner Arquitectónico (${refinerResult?.templateUsed?.name || 'Profesional'}).`
        });
      } else {
        throw new Error("No image data returned from Gemini API");
      }
    } catch (error: any) {
      console.error('Image generation route error:', error);
      res.status(500).json({ success: false, error: error.message || 'Error generating image' });
    }
  });

  // Google Gemini Veo Video Generation Endpoints (Prompt-Enhanced with Reference Image & Social Framing)
  app.post('/api/gemini/generate-video', async (req, res) => {
    try {
      const { 
        promptText, 
        duration = 5, 
        ratio = '16:9', 
        resolution = '1080p', 
        referenceImage,
        referenceEmailText = '',
        platform = 'TikTok & Reels'
      } = req.body;

      const ai = getGeminiClient();

      // Step 1: Optimize raw video prompt into high-octane cinematic motion prompt WITH multimodal reference inspection
      let optimizedVideoPrompt = promptText || 'Cinematic slow-motion 60fps commercial reveal with soft directional lighting';
      try {
        const optParts: any[] = [];
        if (referenceImage && typeof referenceImage === 'string') {
          let mimeType = 'image/png';
          let base64Data = referenceImage;
          if (referenceImage.includes(';base64,')) {
            const splitData = referenceImage.split(';base64,');
            mimeType = splitData[0].replace('data:', '') || 'image/png';
            base64Data = splitData[1];
          }
          optParts.push({
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          });
        }

        optParts.push({
          text: `You are an elite Hollywood commercial cinematographer and Veo video director.
Visually inspect the reference image (if attached) and reference brief:
${referenceImage ? '- A visual reference image is attached above. Strictly maintain the exact product shape, geometry, brand markers, materials, textures, and color scheme.' : ''}
- Transform this concept into an ultra-photorealistic, high-motion cinematic prompt for Google Veo.
- Anchor the opening frame to the reference product appearance.
- Camera movement: Smooth 60fps cinematic camera move (e.g. slow 360-degree orbital arc, smooth dolly push-in, or elegant macro tilt) highlighting the product's finish.
- Lighting: Warm 3-point volumetric studio lighting with subtle rim light and reflections.
- Framed for aspect ratio: ${ratio === '9:16' ? 'Vertical 9:16 social-first format with safe center zones' : 'Cinematic horizontal 16:9 widescreen'}.
- Target platform: ${platform}.
${referenceEmailText ? `- Reference Email / Client notes: "${referenceEmailText}".` : ''}
- User idea: "${promptText}".
Output ONLY the final optimized English prompt in one single sentence (120-160 words), no markdown.`
        });

        const optRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts: optParts }
        });
        if (optRes.text && optRes.text.trim().length > 10) {
          optimizedVideoPrompt = optRes.text.trim();
        }
      } catch (optErr: any) {
        console.warn('Video prompt optimization notice:', optErr.message);
      }

      const videoConfig: any = {
        numberOfVideos: 1,
        resolution: resolution === '1080p' ? '1080p' : '720p',
        aspectRatio: ratio === '16:9' ? '16:9' : '9:16'
      };

      const videoPayload: any = {
        model: 'veo-3.1-generate-preview',
        prompt: optimizedVideoPrompt,
        config: videoConfig
      };

      if (referenceImage && typeof referenceImage === 'string') {
        let mimeType = 'image/png';
        let base64Data = referenceImage;
        if (referenceImage.includes(';base64,')) {
          const splitData = referenceImage.split(';base64,');
          mimeType = splitData[0].replace('data:', '') || 'image/png';
          base64Data = splitData[1];
        }
        videoPayload.image = {
          imageBytes: base64Data,
          mimeType: mimeType
        };
      }

      let operation;
      try {
        operation = await ai.models.generateVideos(videoPayload);
      } catch (veoPrimaryErr: any) {
        console.warn('Veo 3.1 primary notice, attempting veo-3.1-lite fallback:', veoPrimaryErr.message);
        videoPayload.model = 'veo-3.1-lite-generate-preview';
        operation = await ai.models.generateVideos(videoPayload);
      }

      res.json({
        success: true,
        operationName: operation.name,
        optimizedPrompt: optimizedVideoPrompt,
        hasReference: !!referenceImage,
        ratio,
        resolution
      });
    } catch (error: any) {
      console.warn('Gemini Veo endpoint notice:', error.message);
      res.status(200).json({
        success: false,
        simulation: true,
        message: error.message || 'Running Google Veo client-side high-definition video synthesis.'
      });
    }
  });

  app.post('/api/gemini/video-status', async (req, res) => {
    try {
      const { operationName } = req.body;
      if (!operationName) {
        return res.status(400).json({ success: false, error: 'operationName required' });
      }
      const { GenerateVideosOperation } = await import('@google/genai');
      const ai = getGeminiClient();

      const op = new GenerateVideosOperation();
      op.name = operationName;
      const updated = await ai.operations.getVideosOperation({ operation: op });

      res.json({
        success: true,
        done: updated.done,
        error: updated.error
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/gemini/video-download', async (req, res) => {
    try {
      const { operationName } = req.body;
      if (!operationName) {
        return res.status(400).json({ success: false, error: 'operationName required' });
      }
      const { GenerateVideosOperation } = await import('@google/genai');
      const ai = getGeminiClient();

      const op = new GenerateVideosOperation();
      op.name = operationName;
      const updated = await ai.operations.getVideosOperation({ operation: op });
      const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
      if (!uri) {
        return res.status(404).json({ success: false, error: 'Video URI not found' });
      }
      const key = process.env.GEMINI_API_KEY || '';
      const videoRes = await fetch(uri, {
        headers: { 'x-goog-api-key': key }
      });
      res.setHeader('Content-Type', 'video/mp4');
      const arrayBuffer = await videoRes.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } catch (error: any) {
      console.error('Video download error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Video Proxy Endpoint to safely stream MP4s with full CORS and Range support
  app.get('/api/video-proxy', async (req, res) => {
    try {
      const videoUrl = req.query.url as string;
      if (!videoUrl) {
        return res.status(400).send('URL query parameter required');
      }

      const response = await fetch(videoUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        return res.status(response.status).send(`Failed to fetch video: ${response.statusText}`);
      }

      res.setHeader('Content-Type', response.headers.get('content-type') || 'video/mp4');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=86400');

      const arrayBuffer = await response.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } catch (error: any) {
      console.warn('Video proxy error:', error.message);
      res.status(500).send('Error proxying video');
    }
  });

  // In development mode (without pre-built dist), mount Vite middlewares for HMR
  if (isDevelopment && !hasDist) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production or when dist exists, serve static pre-built files
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: `Endpoint not found: ${req.path}` });
      }
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send('<!DOCTYPE html><html><head><title>UNITEC Content Engine</title></head><body><div id="root"></div><p>Loading application...</p></body></html>');
      }
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${PORT} already in use; a server instance is already running.`);
    } else {
      console.error(`Server error on port ${PORT}:`, err);
    }
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
// trigger rebuild
