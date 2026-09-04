import os

with open('server.ts', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    new_lines.append(line)
    if "app.post('/api/gemini/generate-image', async (req, res) => {" in line:
        script_code = """
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
"""
        new_lines.append(script_code)

with open('server.ts', 'w') as f:
    f.writelines(new_lines)
