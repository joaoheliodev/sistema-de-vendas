const API_KEY = process.env.GEMINI_API_KEY || "YOUR_API_KEY";

async function main() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await res.json();
    const validModels = data.models.filter((m: any) => m.supportedGenerationMethods?.includes('generateContent') && !m.name.includes('vision') && !m.name.includes('robotics'));
    console.log("Modelos validos:", validModels.map((m: any) => m.name));
  } catch (error: any) {
    console.error("FALHA!", error.message);
  }
}

main();
