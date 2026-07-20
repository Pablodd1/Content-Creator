/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
      apiKey: process.env.GEMINI_API_KEY || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
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
      const { title, target, objective, want, language = 'ES' } = req.body;
      
      if (!title && !target && !objective && !want) {
        return res.status(400).json({ 
          success: false, 
          error: 'Please fill out at least one of the input fields to generate content.' 
        });
      }

      const ai = getGeminiClient();
      
      const systemInstruction = `You are a professional social media copywriter specialized in luxury interior design and premium PVC wallpaper marketing for unitecusadesign.com.
Your goal is to write a single, extremely engaging, high-converting social media post that fits multiple platforms (Instagram, Facebook, LinkedIn, YouTube).
Ensure you maintain an elegant, high-end, bilingually integrated structure or focus primarily on Spanish (Colombia targeted) with clean, professional accents.`;

      const prompt = `Please generate a single creative social media post using the following details:
- Title/Hook: "${title || 'Not specified'}"
- Target Audience/Segment: "${target || 'Not specified'}"
- Strategy Objective: "${objective || 'Not specified'}"
- Specific Want/Creative Angle: "${want || 'Not specified'}"

Format requirements:
1. Write a captivating headline using the Title.
2. Structure the body with elegant spacing and subtle bullet points.
3. Make sure to call to action (direct to website: unitecusadesign.com).
4. Do not over-use emojis on professional angles. Keep it sleek.
5. Provide a block of highly relevant hashtags at the very end.
6. Return the post in ${language === 'EN' ? 'English' : 'Spanish (with secondary English translation if requested or helpful)'}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.8,
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
      const { apiKey, promptText, model, seconds, ratio, options } = req.body;
      if (!apiKey) {
        return res.status(400).json({ success: false, error: 'Runway API Key is required' });
      }

      // Check if API key is provided
      if (!apiKey || apiKey.trim().length === 0) {
        return res.status(400).json({ success: false, error: 'Runway API Key is required' });
      }

      // Initialize runway client with the provided key
      // Dynamic import to avoid missing dependencies
      const { RunwayML } = await import('@runwayml/sdk');
      const runway = new RunwayML({ apiKey: apiKey.trim() });
      
      let width = 768;
      let height = 1280;
      if (ratio === '1280:768' || ratio === '1280:720') {
        width = 1280;
        height = 768;
      }

      // Create video generation task
      let task;
      task = await (runway.textToVideo.create as any)({
        model: 'gen3a_alpha',
        promptText: promptText,
        ratio: ratio || '720:1280',
        duration: seconds || 5
      });

      res.json({
        success: true,
        job_id: (task as any).id,
      });
    } catch (error: any) {
      console.error('Runway generation error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to start Runway video generation'
      });
    }
  });

  // Proxy for Runway API task checking
  app.get('/api/runway/status/:taskId', async (req, res) => {
    try {
      const { taskId } = req.params;
      const authHeader = req.headers.authorization;
      const apiKey = authHeader ? authHeader.split(' ')[1] : '';

      if (!apiKey) {
        return res.status(400).json({ success: false, error: 'Runway API Key is required' });
      }

      const { RunwayML } = await import('@runwayml/sdk');
      const runway = new RunwayML({ apiKey: apiKey.trim() });

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
  const isProduction = process.env.NODE_ENV === 'production' || hasBuild;

  // Serve static assets or mount Vite middleware
  if (isProduction) {
    console.log(`Production mode active. Serving static files from: ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
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
          res.sendFile(path.join(distPath, 'index.html'));
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
