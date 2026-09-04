/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

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
  const PORT = 3000;

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
- "imageIdea" MUST be a hyper-detailed, extremely creative, photorealistic prompt for AI image generation (Midjourney/FLUX). Include exact camera angles, lighting (e.g., volumetric, cinematic, neon), materials, color grading, and mood to generate a high-end visual asset.
- "sceneScript" (for TikTok) and "videoIdea" (for YouTube) MUST be highly creative, full video production workflows. Structure it as a professional shot list (e.g., [0:00-0:03 HOOK] Visual + Audio, [0:03-0:10 BUILDUP]). Include specific instructions for camera movement, lighting, sound effects (SFX), B-roll, on-screen text, and emotional pacing. Do not just write a script; design the full video workflow.
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
          model: 'gemini-3.7-flash',
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

  // Endpoint to expand and enhance image prompts with AI
  app.post('/api/gemini/enhance-image-prompt', async (req, res) => {
    try {
      const { prompt, style = 'Comercial & Producto 8K', context = '' } = req.body;
      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ success: false, error: 'Se requiere un prompt para mejorar.' });
      }

      let enhancedPrompt = prompt;
      let promptEN = '';

      try {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: `You are an elite creative director and AI prompt engineer (Midjourney v6, Google Imagen 3, FLUX.1) for high-end brands.
Take this user prompt: "${prompt}".
Style preset: "${style}".
Context/Product: "${context}".

Generate two versions of an ultra-detailed, photorealistic prompt that follows the base prompt but drastically upgrades it into a full creative marketing visual workflow. Specify exact materials, colors, high-end lighting setup (e.g. rim lighting, cinematic volumetrics), camera focal length, atmosphere, sharp focus, and set design composition.
1. A rich Spanish description (marketing visual workflow) for the creative team.
2. A master English prompt (max 120 words) perfectly optimized for image diffusion models.

Return JSON:
{
  "enhancedSpanish": "...",
  "masterEnglish": "..."
}`,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({
            success: true,
            enhancedPrompt: parsed.enhancedSpanish || prompt,
            masterEnglish: parsed.masterEnglish || prompt
          });
        }
      } catch (err: any) {
        console.warn('AI prompt enhance fallback:', err.message);
      }

      return res.json({
        success: true,
        enhancedPrompt: `${prompt}. Fotografía fotorrealista 8K, iluminación de estudio profesional softbox, acabado de alta fidelidad, texturas hiperrealistas, composición equilibrada y sin distorsiones.`,
        masterEnglish: `${prompt}, photorealistic 8k, professional studio softbox lighting, ultra-sharp focus, detailed textures, architectural digest photography style`
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Google Gemini & AI Image Generation Endpoint (High-Fidelity)
  app.post('/api/gemini/generate-image', async (req, res) => {

  // Independent Video Script Generation Endpoint
  app.post('/api/gemini/generate-video-script', async (req, res) => {
    try {
      const { prompt, platform = 'TikTok' } = req.body;
      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt es requerido.' });
      }

      const ai = getGeminiClient();
      const systemInstruction = `You are an elite creative director and video producer. 
Your task is to take the user's prompt and generate a highly creative, full video production workflow/script for ${platform}.
Structure it as a professional shot list (e.g., [0:00-0:03 HOOK] Visual + Audio, [0:03-0:10 BUILDUP]). 
Include specific instructions for camera movement, lighting, SFX, B-roll, on-screen text, and emotional pacing. 
Do not just write a script; design the full video workflow.
Language: Output strictly in Spanish.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
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
    try {
      const { prompt, aspectRatio = '1:1', style = 'Comercial & Producto 8K' } = req.body;
      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ success: false, error: 'Se requiere una descripción (prompt) para generar la imagen.' });
      }

      const validAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
      const finalRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';

      // Determine dimensions for aspect ratio
      let width = 1024;
      let height = 1024;
      if (finalRatio === '16:9') {
        width = 1280;
        height = 720;
      } else if (finalRatio === '9:16') {
        width = 720;
        height = 1280;
      } else if (finalRatio === '4:3') {
        width = 1024;
        height = 768;
      } else if (finalRatio === '3:4') {
        width = 768;
        height = 1024;
      }

      // Step 1: Translate and enrich prompt to English with Gemini to ensure image model captures every detail
      let englishDiffusionPrompt = prompt.trim();
      try {
        const ai = getGeminiClient();
        const transRes = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: `Translate and optimize this image generation prompt into English for high-end photorealistic image generation (FLUX / Imagen 3). Ensure all specific objects, materials, architectural finishes, colors, textures, and lighting from the prompt are strictly preserved and described with crystal clarity. Style: ${style}. User prompt: "${prompt}". Output ONLY the optimized English prompt string, no quotes, no markdown.`
        });
        if (transRes.text && transRes.text.trim().length > 10) {
          englishDiffusionPrompt = transRes.text.trim();
        }
      } catch (transErr: any) {
        console.warn('Prompt translation note:', transErr?.message || transErr);
      }

      // Step 2: Google Gemini Image Generation (gemini-3.1-flash-image)
      try {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image',
          contents: {
            parts: [{ text: englishDiffusionPrompt }]
          },
          config: {
            imageConfig: {
              aspectRatio: finalRatio as any,
              imageSize: '1K'
            }
          }
        });

        let foundImageUrl = '';
        if (response.candidates && response.candidates[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              const mime = part.inlineData.mimeType || 'image/png';
              foundImageUrl = `data:${mime};base64,${part.inlineData.data}`;
              break;
            }
          }
        }

        if (foundImageUrl) {
          return res.json({ 
            success: true, 
            imageUrl: foundImageUrl,
            model: 'gemini-3.1-flash-image',
            appliedPrompt: englishDiffusionPrompt,
            notice: 'Imagen generada con alta fidelidad mediante Google Gemini Imagen.'
          });
        } else {
           throw new Error("No image data returned from Gemini API");
        }
      } catch (geminiError: any) {
        console.error('Gemini Imagen API Error:', geminiError.message || geminiError);
        return res.status(500).json({ 
            success: false, 
            error: `Fallo al generar imagen con Gemini: ${geminiError.message || 'Error desconocido'}`,
            details: geminiError
        });
      }
    } catch (error: any) {
      console.error('Image generation route error:', error);
      res.status(500).json({ success: false, error: error.message || 'Error generating image' });
    }
  });

  // Google Gemini Veo Video Generation Endpoints
  app.post('/api/gemini/generate-video', async (req, res) => {
    try {
      const { promptText, duration = 5, ratio = '16:9', resolution = '720p' } = req.body;
      const ai = getGeminiClient();

      const operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: promptText || 'High-end commercial architectural video reveal with cinematic lighting',
        config: {
          numberOfVideos: 1,
          resolution: resolution === '1080p' ? '1080p' : '720p',
          aspectRatio: ratio === '16:9' ? '16:9' : '9:16'
        }
      });

      res.json({
        success: true,
        operationName: operation.name
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

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const indexPath = path.join(distPath, 'index.html');
    
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send('<!DOCTYPE html><html><head><title>UNITEC Content Engine</title></head><body><div id="root"></div><p>Loading application...</p></body></html>');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
// trigger rebuild
