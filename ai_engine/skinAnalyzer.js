const OpenAI = require('openai');
const fs = require('fs');

// Check if we should use mock mode (no API key or TEST_MODE enabled)
const useMockMode = process.env.MOCK_MODE === 'true' || !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here';

if (useMockMode) {
  console.log('🔧 MOCK MODE: Using mock skin analyzer (no OpenAI API key required)');
  // Use mock implementation
  const mockAnalyzer = require('./mockSkinAnalyzer');
  module.exports = mockAnalyzer;
} else {
  // Use real OpenAI implementation
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  // Static system message for prompt caching (reduces costs by ~50%)
const SYSTEM_MESSAGE = `You are an expert dermatologist AI. Analyze facial selfies and provide detailed skin analysis.

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

  // Regex-based JSON extraction fallback
  function extractJSON(text) {
  // First, try to find JSON object boundaries
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      // If that fails, try cleaning common markdown patterns
      const cleaned = jsonMatch[0]
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^[^{]*/, '') // Remove anything before first {
        .replace(/[^}]*$/, '}'); // Ensure ends with }
      
      try {
        return JSON.parse(cleaned);
      } catch (e2) {
        // Last resort: try to extract key-value pairs
        const fallback = {
          skinType: (text.match(/"skinType"\s*:\s*"([^"]+)"/) || [])[1] || "Normal",
          issues: [],
          confidence: parseInt((text.match(/"confidence"\s*:\s*(\d+)/) || [])[1] || "50")
        };
        
        // Extract issues array if possible
        const issuesMatch = text.match(/"issues"\s*:\s*\[([^\]]*)\]/);
        if (issuesMatch) {
          // Simple extraction - may not be perfect but prevents complete failure
          const issuesText = issuesMatch[1];
          const categoryMatches = issuesText.matchAll(/"category"\s*:\s*"([^"]+)"/g);
          for (const match of categoryMatches) {
            fallback.issues.push({
              category: match[1],
              severity: "Moderate",
              details: "Detected from image analysis"
            });
          }
        }
        
        console.warn('Using fallback JSON extraction:', fallback);
        return fallback;
      }
    }
  }
  
  throw new Error('No JSON object found in response');
}

  // Analyze skin using OpenAI Vision
  async function analyzeSkin(imagePath) {
  try {
    // Read image and convert to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    // Use gpt-4o-mini for 90% cost reduction (same quality for vision tasks)
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-optimized: ~$0.15/1M input tokens vs $2.50/1M for gpt-4o
      messages: [
        {
          role: "system",
          content: SYSTEM_MESSAGE // System message enables prompt caching
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this facial selfie and provide skin analysis." },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      response_format: { type: "json_object" }, // Forces JSON output, prevents parsing errors
      max_tokens: 1000,
      temperature: 0.3
    });

    const analysisText = response.choices[0].message.content.trim();
    
    // Parse JSON response with fallback
    let analysis;
    try {
      // Direct parse first (should work with response_format: json_object)
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.warn('Direct JSON parse failed, using fallback extraction:', parseError.message);
      // Use regex-based fallback
      analysis = extractJSON(analysisText);
    }

    // Validate required fields
    if (!analysis.skinType || !Array.isArray(analysis.issues)) {
      throw new Error('Invalid analysis structure: missing skinType or issues');
    }

    return analysis;
  } catch (error) {
    console.error('Skin analysis error:', error);
    throw error;
  }
}

  module.exports = { analyzeSkin };
}
