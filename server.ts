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
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Helper for resolving Runway API key
function resolveRunwayApiKey(req: express.Request): string {
  const authHeader = req.headers.authorization || '';
  const headerKey = authHeader.replace(/^Bearer\s+/i, '').trim();
  const bodyKey = (req.body && req.body.apiKey) ? req.body.apiKey.trim() : '';
  const clientApiKey = headerKey || bodyKey;
  const serverApiKey = process.env.RUNWAY_API_KEY ? process.env.RUNWAY_API_KEY.trim() : '';
  return clientApiKey.startsWith('key_') ? clientApiKey : (serverApiKey.startsWith('key_') ? serverApiKey : clientApiKey);
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // JSON request parsing support
  app.use(express.json());

  // API Health Check Route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Universal Social Media Post Generator endpoint (Multimodal support for text & images)
  app.post('/api/generate-universal-post', async (req, res) => {
    try {
      const {
        title,
        target,
        objective,
        want,
        tone = 'Sales-driven',
        platform = 'All Platforms',
        complianceFlags = [],
        language = 'ES',
        documentTexts = [],
        images = []
      } = req.body;
      
      if (!title && !target && !objective && !want && (!documentTexts || documentTexts.length === 0) && (!images || images.length === 0)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Por favor ingresa instrucciones o adjunta archivos para generar contenido.' 
        });
      }

      const ai = getGeminiClient();
      
      const complianceText = complianceFlags && complianceFlags.length > 0 
        ? `Mandatory Compliance & Product Features to Include: ${complianceFlags.join(', ')}.`
        : '';

      const systemInstruction = `You are a world-class creative director and senior social media strategist.
Your task is to write high-converting, highly engaging, professional social media copy tailored to ${tone} tone and targeted for ${platform}.
Maintain a sleek, modern, sophisticated voice. Integrate all background details, extracted document text, and visual context from attached images.`;

      let combinedTextPrompt = `Please generate an individual, highly optimized social media campaign post based on the following creative parameters:

📌 CREATIVE BRIEF:
- Title / Hook Line: "${title || 'Lanzamiento de Campaña'}"
- Target Audience / Segment: "${target || 'Audiencia General y Clientes Potenciales'}"
- Strategic Objective: "${objective || 'Aumentar engagement, visibilidad y conversiones'}"
- Specific Want / Creative Angle: "${want || 'Destacar beneficios clave y propuesta de valor'}"
- Desired Tone of Voice: ${tone}
- Target Platform Focus: ${platform}
${complianceText ? `- Compliance Mandates: ${complianceText}` : ''}`;

      if (Array.isArray(documentTexts) && documentTexts.length > 0) {
        combinedTextPrompt += `\n\n📄 DOCUMENTOS Y TEXTO DE REFERENCIA EXTRAÍDOS DE ARCHIVOS:\n` + documentTexts.join('\n\n---\n\n');
      }

      combinedTextPrompt += `\n\nREQUIRED OUTPUT FORMAT (Return clean text with these exact formatted sections):

✨ [TITULAR IMPACTANTE / HOOK]
(Crea una línea de apertura de alto impacto que capte la atención de inmediato)

📖 [CUERPO DEL MENSAJE / POST]
(Escribe 2-3 párrafos atractivos y bien estructurados con viñetas destacando la propuesta de valor y los beneficios principales)

🔒 [PUNTOS CLAVE Y ESPECIFICACIONES]
(Incluye los aspectos técnicos, diferenciadores o características clave relevantes extraídos de los documentos y contexto)

🎯 [LLAMADO A LA ACCIÓN / CALL TO ACTION]
(Guía clara hacia el siguiente paso: visitar el sitio web, contactar por WhatsApp o solicitar más información)

🎬 [PROMPT PARA CREATIVO VISUAL (Runway / Gemini Veo / Midjourney)]
(Proporciona una descripción detallada en español e inglés para generar la imagen o video publicitario acompañante)

🏷️ [HASHTAGS RECOMENDADOS]
(Proporciona 10-12 hashtags estratégicos para maximizar el alcance en Instagram, Facebook, TikTok y LinkedIn)

Language: Output strictly in Spanish.`;

      const parts: any[] = [{ text: combinedTextPrompt }];

      // Process uploaded images for multimodal input
      if (Array.isArray(images) && images.length > 0) {
        for (const imgStr of images) {
          if (typeof imgStr === 'string' && imgStr.includes('base64,')) {
            const mimeMatch = imgStr.match(/^data:(image\/[a-zA-Z+]+);base64,/);
            const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
            const base64Data = imgStr.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
            parts.push({
              inlineData: {
                mimeType,
                data: base64Data
              }
            });
          }
        }
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: parts.length === 1 ? parts[0].text : { parts },
        config: {
          systemInstruction,
          temperature: 0.75,
        }
      });

      res.json({ 
        success: true, 
        text: response.text 
      });
    } catch (error: any) {
      console.error('Gemini post generation error:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to communicate with the Gemini API. Please make sure the GEMINI_API_KEY is configured.' 
      });
    }
  });

  // Google Gemini Veo Video Generation Endpoints
  app.post('/api/gemini/generate-video', async (req, res) => {
    try {
      const { promptText, duration = 5, ratio = '16:9', resolution = '720p' } = req.body;
      const ai = getGeminiClient();

      const operation = await ai.models.generateVideos({
        model: 'veo-3.1-generate-preview',
        prompt: promptText || 'High-end commercial architectural video reveal',
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
        message: 'Running Google Veo client-side high-definition video synthesis.'
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

  // Proxy for Runway API task creation
  app.post('/api/runway/generate', express.json(), async (req, res) => {
    try {
      const { promptText, model, seconds, ratio, options } = req.body;
      const finalApiKey = resolveRunwayApiKey(req);

      if (!finalApiKey || finalApiKey.length === 0 || finalApiKey === 'use_server_key') {
        return res.status(200).json({ 
          success: false, 
          simulation: true,
          message: 'No external Runway API Key provided. Running client-side high-definition synthesis pipeline.' 
        });
      }

      // Initialize runway client with the provided key
      const { RunwayML } = await import('@runwayml/sdk');
      const runway = new RunwayML({ apiKey: finalApiKey });

      // Create video generation task with safe fallback for models
      let task;
      try {
        task = await (runway.textToVideo.create as any)({
          model: model || 'gen4.5',
          promptText: promptText,
          ratio: ratio || '720:1280',
          duration: seconds || 5
        });
      } catch (sdkError: any) {
        console.warn('Runway gen4.5 attempt note, retrying with gen3a_turbo:', sdkError.message);
        task = await (runway.textToVideo.create as any)({
          model: 'gen3a_turbo',
          promptText: promptText,
          ratio: ratio || '720:1280',
          duration: seconds || 5
        });
      }

      res.json({
        success: true,
        job_id: (task as any).id,
      });
    } catch (error: any) {
      console.error('Runway generation endpoint note:', error.message);
      res.status(200).json({
        success: false,
        error: error.message || 'Failed to start Runway video generation. Using high-definition local synthesis fallback.'
      });
    }
  });

  // Proxy for Runway API task checking
  app.get('/api/runway/status/:taskId', async (req, res) => {
    try {
      const { taskId } = req.params;
      const finalApiKey = resolveRunwayApiKey(req);
      
      if (!finalApiKey) {
        return res.status(400).json({ success: false, error: 'Runway API Key is required' });
      }

      const { RunwayML } = await import('@runwayml/sdk');
      const runway = new RunwayML({ apiKey: finalApiKey });

      const task = await runway.tasks.retrieve(taskId) as any;

      res.json({
        success: true,
        status: task.status,
        progress: task.progress,
        output: task.output,
        failureReason: task.failureReason
      });
    } catch (error: any) {
      console.error('Runway status check error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to check Runway task status'
      });
    }
  });

  const distPath = path.join(process.cwd(), 'dist');
  const hasBuild = fs.existsSync(path.join(distPath, 'index.html'));
  const isProduction = process.env.NODE_ENV === 'production';

  // Serve static assets or mount Vite middleware
  if (isProduction) {
    console.log(`Production mode active. Serving static files from: ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (fs.existsSync(path.join(distPath, 'index.html'))) {
        res.sendFile(path.join(distPath, 'index.html'));
      } else {
        res.status(503).send('Application is currently starting or building. Please reload in a few seconds.');
      }
    });
  } else {
    console.log('Development mode active. Attempting to mount Vite middleware...');
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('Vite middleware mounted successfully for development.');
    } catch (err) {
      console.error('Failed to mount Vite middleware, checking for static build fallback:', err);
      if (hasBuild) {
        console.log('Static build files found. Falling back to static file serving.');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
          if (fs.existsSync(path.join(distPath, 'index.html'))) {
            res.sendFile(path.join(distPath, 'index.html'));
          } else {
            res.status(503).send('Application is currently starting or building. Please reload in a few seconds.');
          }
        });
      } else {
        app.get('*', (req, res) => {
          res.status(503).send('Application is currently starting or building. Please reload in a few seconds.');
        });
      }
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
