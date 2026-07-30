var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "50mb" }));
  app.use(import_express.default.urlencoded({ limit: "50mb", extended: true }));
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
            "User-Agent": "aistudio-build"
          }
        }
      });
      const base64Data = pdfData.split(",")[1] || pdfData;
      const generateWithRetryAndFallback = async (modelsToTry, maxRetriesPerModel = 3) => {
        let lastError = null;
        for (const modelName of modelsToTry) {
          let delay = 1e3;
          console.log(`Attempting to parse PDF using model: ${modelName}`);
          for (let attempt = 1; attempt <= maxRetriesPerModel; attempt++) {
            try {
              const response2 = await client.models.generateContent({
                model: modelName,
                contents: [
                  {
                    inlineData: {
                      mimeType: "application/pdf",
                      data: base64Data
                    }
                  },
                  {
                    text: "Extract the title, author, and pages/chapters of this book. Split the text into logical readable pages (each about 500-1500 words). If the book is short, split it logically by chapters or pages so the reader can read page-by-page. Maintain high-fidelity formatting, spacing, and headings."
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
                          type: Type.STRING
                        },
                        description: "The array of extracted pages or chapters text"
                      }
                    },
                    required: ["title", "author", "pages"]
                  }
                }
              });
              return response2;
            } catch (err) {
              lastError = err;
              const errMsg = err?.message || "";
              const errStatus = err?.status || err?.code;
              const isTransient = errStatus === 503 || errMsg.includes("503") || errMsg.includes("temporary") || errMsg.includes("UNAVAILABLE") || errMsg.includes("high demand");
              console.warn(`[PDF Parse] Attempt ${attempt} with model ${modelName} failed: ${errMsg}`);
              if (isTransient && attempt < maxRetriesPerModel) {
                console.log(`Transient error. Retrying ${modelName} in ${delay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
                delay *= 2;
              } else {
                break;
              }
            }
          }
        }
        throw lastError || new Error("Failed to parse PDF with all available models.");
      };
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
    } catch (error) {
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
      const { GoogleGenAI } = await import("@google/genai");
      const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      res.status(501).json({ error: "Image generation not yet implemented" });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate image" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
