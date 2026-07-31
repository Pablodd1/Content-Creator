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
  const PORT = 3000;

  // JSON request parsing support
  app.use(express.json());

  // API Health Check Route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Universal Social Media Post Generator endpoint
  app.post('/api/generate-universal-post', async (req, res) => {
    try {
      const { title, target, objective, want, tone = 'Sales-driven', platform = 'All Platforms', complianceFlags = [], language = 'ES' } = req.body;
      
      if (!title && !target && !objective && !want) {
        return res.status(400).json({ 
          success: false, 
          error: 'Please fill out at least one of the input fields to generate content.' 
        });
      }

      const ai = getGeminiClient();
      
      const complianceText = complianceFlags && complianceFlags.length > 0 
        ? `Mandatory Compliance & Product Features to Include: ${complianceFlags.join(', ')}.`
        : '';

      const systemInstruction = `You are a world-class creative director and senior social media strategist specialized in luxury interior design, architectural finishes, and high-end PVC wallpapers for UNITEC USA Design (unitecusadesign.com).
Your task is to write high-converting, highly engaging, professional social media copy tailored to ${tone} tone and targeted for ${platform}.
Maintain a sleek, modern, sophisticated voice. Integrate high-value interior architecture terminology (e.g., 3D reliefs, 100% waterproof PVC, European design, NSR-10 fire retardation standards, FOB container wholesale distribution).`;

      const prompt = `Please generate an individual, highly optimized social media campaign post based on the following creative parameters:

📌 CREATIVE BRIEF:
- Title / Hook Line: "${title || 'Luxury PVC Wallpaper & 3D Wall Cladding'}"
- Target Audience / Segment: "${target || 'Interior designers, architects, builders, and wholesale distributors in Colombia & US'}"
- Strategic Objective: "${objective || 'Drive digital showroom traffic and container orders at unitecusadesign.com'}"
- Specific Want / Creative Angle: "${want || 'Highlight durability, European aesthetic, and waterproof features'}"
- Desired Tone of Voice: ${tone}
- Target Platform Focus: ${platform}
${complianceText ? `- Compliance Mandates: ${complianceText}` : ''}

REQUIRED OUTPUT FORMAT (Return clean text with these exact formatted sections):

✨ [CAPTURE HOOK / HEADLINE]
(Create a high-impact, attention-grabbing opening line)

📖 [MAIN POST BODY]
(Write 2-3 engaging, well-spaced paragraphs with subtle bullet points highlighting value propositions and material benefits)

🔒 [TECHNICAL & COMPLIANCE SPECIFICATIONS]
(Include waterproof, washable PVC details, NSR-10 safety standards, or container shipment terms where appropriate)

🎯 [CALL TO ACTION]
(Direct traffic to browse catalog / request sample boards at unitecusadesign.com)

🎬 [PAIRED AI VISUAL ASSET PROMPT (Runway / Midjourney)]
(Provide a ready-to-use high-definition visual prompt description for AI image or video generation of this product scene)

🏷️ [HASHTAGS]
(Provide 10-12 highly targeted, high-performing hashtags for Instagram, LinkedIn, Facebook, and YouTube)

Language: Output strictly in ${language === 'EN' ? 'English' : 'Spanish (with high-end Colombian & US international terminology)'}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
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
