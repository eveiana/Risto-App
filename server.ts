import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/parse-pdf", async (req, res) => {
    const { pdfData } = req.body;
    if (!pdfData) {
      return res.status(400).json({ error: "pdfData is required" });
    }

    try {
      const { GoogleGenAI, Type } = await import("@google/genai");
      const client = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Extract the raw base64 string from data URL if present
      const base64Data = pdfData.split(",")[1] || pdfData;

      // Robust retry-with-backoff function to handle temporary 503/high-demand spikes
      const generateWithRetryAndFallback = async (modelsToTry: string[], maxRetriesPerModel = 3) => {
        let lastError: any = null;

        for (const modelName of modelsToTry) {
          let delay = 1000;
          console.log(`Attempting to parse PDF using model: ${modelName}`);
          
          for (let attempt = 1; attempt <= maxRetriesPerModel; attempt++) {
            try {
              const response = await client.models.generateContent({
                model: modelName,
                contents: [
                  {
                    inlineData: {
                      mimeType: "application/pdf",
                      data: base64Data,
                    },
                  },
                  {
                    text: "Extract the title, author, and pages/chapters of this book. Split the text into logical readable pages (each about 500-1500 words). If the book is short, split it logically by chapters or pages so the reader can read page-by-page. Maintain high-fidelity formatting, spacing, and headings.",
                  }
                ],
                config: {
                  responseMimeType: "application/json",
                  responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                      title: {
                        type: Type.STRING,
                        description: "The extracted title of the book"
                      },
                      author: {
                        type: Type.STRING,
                        description: "The extracted author name of the book"
                      },
                      pages: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.STRING,
                        },
                        description: "The array of extracted pages or chapters text"
                      },
                    },
                    required: ["title", "author", "pages"],
                  },
                },
              });
              return response;
            } catch (err: any) {
              lastError = err;
              const errMsg = err?.message || "";
              const errStatus = err?.status || err?.code;
              const isTransient = errStatus === 503 || errMsg.includes("503") || errMsg.includes("temporary") || errMsg.includes("UNAVAILABLE") || errMsg.includes("high demand");
              
              console.warn(`[PDF Parse] Attempt ${attempt} with model ${modelName} failed: ${errMsg}`);
              
              if (isTransient && attempt < maxRetriesPerModel) {
                console.log(`Transient error. Retrying ${modelName} in ${delay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
              } else {
                // Break inner loop to try next model immediately if it's not transient or out of retries
                break;
              }
            }
          }
        }
        throw lastError || new Error("Failed to parse PDF with all available models.");
      };

      // Try gemini-2.5-flash (primary stable), fallback to gemini-2.0-flash (highly compatible) or gemini-1.5-flash
      const response = await generateWithRetryAndFallback([
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash"
      ]);

      const resultText = response.text;
      if (!resultText) {
        throw new Error("No response from Gemini API");
      }

      const parsedData = JSON.parse(resultText);
      res.json(parsedData);
    } catch (error: any) {
      console.error("Failed to parse PDF with Gemini:", error);
      res.status(500).json({ error: error?.message || "The AI is currently busy. Please try uploading the document again in a few moments." });
    }
  });

  app.post("/api/generate-image", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    try {
      // Use the gemini-3.1-flash-image-preview model if possible or similar
      // Need to use @google/genai sdk correctly
      // Following gemini_api skill
      const { GoogleGenAI } = await import("@google/genai");
      const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      // Assuming generation call based on common patterns - need to verify with docs if needed
      // Actually, image generation is usually distinct.
      // I'll skip implementation if it's too risky and tell the user, but let's try.
      res.status(501).json({ error: "Image generation not yet implemented" });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate image" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
