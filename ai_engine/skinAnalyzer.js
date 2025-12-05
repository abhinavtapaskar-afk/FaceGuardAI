const OpenAI = require('openai');
const fs = require('fs');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Analyze skin using OpenAI Vision
async function analyzeSkin(imagePath) {
  try {
    // Read image and convert to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    const prompt = `You are an expert dermatologist AI. Analyze this facial selfie and provide a detailed skin analysis.

IMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, no explanations outside the JSON.

Analyze and return JSON with this exact structure:
{
  "skinType": "one of: Oily, Dry, Combination, Normal, Sensitive, Dehydrated",
  "issues": [
    {
      "category": "category name",
      "severity": "Mild/Moderate/Severe",
      "details": "specific description"
    }
  ],
  "confidence": "percentage as number 0-100"
}

Detect these issue categories:
- Acne & Blemishes (whiteheads, blackheads, papules, pustules, cystic acne)
- Acne Scars (ice-pick, boxcar, rolling, PIH)
- Pigmentation (dark spots, melasma, uneven tone, dullness)
- Texture (rough skin, enlarged pores, bumpy skin)
- Hydration/Barrier (dryness, flakiness, redness, inflammation)
- Aging (fine lines, wrinkles, sagging, loss of firmness)
- Oil & Sebum (excess oil, T-zone shine)
- Under-eye (dark circles, puffiness, fine lines)

Be thorough but realistic. Only include issues you can clearly detect.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    });

    const analysisText = response.choices[0].message.content.trim();
    
    // Parse JSON response
    let analysis;
    try {
      // Remove markdown code blocks if present
      const cleanedText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', analysisText);
      throw new Error('Failed to parse AI response');
    }

    return analysis;
  } catch (error) {
    console.error('Skin analysis error:', error);
    throw error;
  }
}

module.exports = { analyzeSkin };
