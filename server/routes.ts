import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFamilySchema, insertGameSessionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Characters routes
  app.get("/api/characters", async (req, res) => {
    try {
      const characters = await storage.getAllCharacters();
      res.json(characters);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch characters" });
    }
  });

  app.get("/api/characters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const character = await storage.getCharacter(id);
      if (!character) {
        return res.status(404).json({ error: "Character not found" });
      }
      res.json(character);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch character" });
    }
  });

  // Mysteries routes
  app.get("/api/mysteries", async (req, res) => {
    try {
      const mysteries = await storage.getAllMysteries();
      res.json(mysteries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mysteries" });
    }
  });

  app.get("/api/mysteries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const mystery = await storage.getMystery(id);
      if (!mystery) {
        return res.status(404).json({ error: "Mystery not found" });
      }
      res.json(mystery);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mystery" });
    }
  });

  // Families routes
  app.get("/api/families", async (req, res) => {
    try {
      const families = await storage.getAllFamilies();
      res.json(families);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch families" });
    }
  });

  app.post("/api/families", async (req, res) => {
    try {
      const validatedData = insertFamilySchema.parse(req.body);
      const family = await storage.createFamily(validatedData);
      res.status(201).json(family);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid family data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create family" });
    }
  });

  // Game session routes
  app.post("/api/game-sessions", async (req, res) => {
    try {
      const validatedData = insertGameSessionSchema.parse(req.body);
      const session = await storage.createGameSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid session data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create game session" });
    }
  });

  app.get("/api/game-sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getGameSession(id);
      if (!session) {
        return res.status(404).json({ error: "Game session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch game session" });
    }
  });

  app.patch("/api/game-sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const session = await storage.updateGameSession(id, updates);
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to update game session" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
