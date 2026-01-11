// Mock skin analyzer for testing without OpenAI API key
// Returns realistic mock data for development/testing

function mockAnalyzeSkin(imagePath) {
  console.log('🔧 MOCK MODE: Using mock skin analyzer (no OpenAI API key required)');
  
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return realistic mock analysis
      const mockAnalysis = {
        skinType: "Combination",
        issues: [
          {
            category: "Acne & Blemishes",
            severity: "Mild",
            details: "Few blackheads and whiteheads detected on T-zone"
          },
          {
            category: "Pigmentation",
            severity: "Moderate",
            details: "Some dark spots and uneven skin tone visible"
          },
          {
            category: "Texture",
            severity: "Mild",
            details: "Slight roughness and enlarged pores on nose area"
          }
        ],
        confidence: 78
      };
      
      resolve(mockAnalysis);
    }, 1000); // Simulate 1 second API call
  });
}

module.exports = { analyzeSkin: mockAnalyzeSkin };


