import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for the Lacto-Fermentation Advisor
  app.post("/api/gemini/advisor", async (req, res) => {
    try {
      const { message, previousMessages = [] } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Missing message field in body." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Return a helpful diagnostic response to guide the user on API setup
        return res.json({
          reply: "The **Brine Master AI Advisor** is ready to assist, but the general system configuration requires your **GEMINI_API_KEY** secret to be active. You can set it up anytime via the **Settings > Secrets** panel in the bottom of your workspace. \n\nIn the meantime, feel free to calibrate salinity and crock volume indices offline!",
          isConfigured: false
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Prepare system instructions for a gourmet, meticulous, witty food curator
      const systemInstruction = `You are "The Brine Master", an expert culinary scientist, traditional grower, and master of lacto-fermentation, canning, and high-heat chili oil crafting. 
Your tone is professional, encouraging, meticulously informative, with a touch of artisan charm. 
You advise on topics like:
1. Optimal salinity ranges (typically 2% to 3.5% for cucumbers, 3% to 5% for chiles)
2. Preventing bad mold vs managing Kahm yeast (organic white films are benign, colorful/fuzzy molds are discarded)
3. Keeping veggies submerged (using fermentation weights, cabbages leaves, or clean weights)
4. Texture troubleshooting (calcium chloride, grape leaves, oak leaves, or bay leaves for crispy tannins)
5. Canning sterilization and safe pH margins (pH must be under 4.6 for shelf-stability, preferably 3.5 to 4.0).

Keep responses relatively concise, structured, friendly, and formatted beautiful with Markdown. Never make up ingredients or fake facts. Promote our Member farm network recipes!`;

      // Build chat prompt sequence
      const formattedHistory = previousMessages.map((m: any) => ({
        role: m.role || "user",
        parts: [{ text: m.text || m.content || "" }]
      }));

      // Create chat session or single query
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction,
          temperature: 0.7,
        },
        history: formattedHistory
      });

      const response = await chat.sendMessage({ message });
      const reply = response.text || "The Brine Master is processing the cure. Please restate the fermentation query.";

      res.json({ reply, isConfigured: true });
    } catch (error: any) {
      console.error("Gemini API Error under server.ts:", error);
      res.status(500).json({ reply: "An error occurred in the Brining Lab receiver: " + error.message, isError: true });
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}

startServer();
