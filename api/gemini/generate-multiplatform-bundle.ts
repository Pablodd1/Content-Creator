import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // CORS configuration for Vercel Serverless
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY no está configurada en las variables de entorno de Vercel.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const {
      product = '',
      audience = '',
      objective = '',
      offer = '',
      contextText = '',
      tone = 'Sales-driven',
      whatsappNumber = '13055550199',
      utmCampaign = 'campana_unitec'
    } = req.body;

    const systemInstruction = `You are a chief growth marketing officer and omnichannel campaign strategist for high-end B2B & B2C brands.
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

Important Rules:
- "imageIdea" should be a detailed, hyper-specific prompt instruction for generating an image.
- "sceneScript" (for TikTok) and "videoIdea" (for YouTube) should be elaborated video instructions.
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

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: 'application/json'
      }
    });

    let variantsData = null;
    if (response.text) {
      variantsData = JSON.parse(response.text);
    }

    if (!variantsData) {
      throw new Error("Respuesta vacía de Gemini");
    }

    return res.status(200).json({
      success: true,
      variants: variantsData
    });

  } catch (err: any) {
    console.error('Vercel API error:', err);
    return res.status(500).json({ 
      success: false, 
      error: err.message || 'Error processing multiplatform request' 
    });
  }
}
