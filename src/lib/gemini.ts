// src/lib/gemini.ts
// This file handles the Magic Prompt enhancement using MDN 1.O Advance model
export const enhancePrompt = async (originalPrompt: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("Gemini API key not configured. Magic Prompt enhancement disabled.");
    return originalPrompt;
  }

  const chatHistory = [];
  chatHistory.push({
    role: "user", 
    parts: [{ text: `Enhance the following image generation prompt for better results, making it more descriptive and creative, suitable for a text-to-image model. Add artistic details, lighting, composition, and quality terms. Do not include any conversational text, just the enhanced prompt itself. Example: "A cat" -> "A fluffy orange cat sitting on a windowsill, with bright green eyes, in a cozy sunlit room, highly detailed, photorealistic, professional photography, soft natural lighting, 8k resolution."\n\nOriginal prompt: "${originalPrompt}"` }]
  });

  const payload = { contents: chatHistory };
  
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    // Check for API errors
    if (result.error) {
      console.warn("Gemini API error:", result.error.message);
      return originalPrompt;
    }

    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      return result.candidates[0].content.parts[0].text;
    } else {
      console.warn("Unexpected API response structure for Magic Prompt enhancement:", result);
      return originalPrompt;
    }
  } catch (error: any) {
    console.warn("Error calling MDN 1.O Advance API for Magic Prompt:", error);
    return originalPrompt;
  }
};
