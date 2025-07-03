import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  ability: text("ability").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
});

export const mysteries = pgTable("mysteries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: integer("difficulty").notNull(), // 1-3
  ageRange: text("age_range").notNull(),
  maxPlayers: integer("max_players").notNull(),
  icon: text("icon").notNull(),
  solved: boolean("solved").default(false),
});

export const families = pgTable("families", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  mysteriesSolved: integer("mysteries_solved").default(0),
  totalPoints: integer("total_points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gameSession = pgTable("game_session", {
  id: serial("id").primaryKey(),
  familyId: integer("family_id").references(() => families.id),
  mysteryId: integer("mystery_id").references(() => mysteries.id),
  selectedCharacters: text("selected_characters").array(),
  currentStep: integer("current_step").default(0),
  cluesFound: text("clues_found").array(),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
});

export const insertMysterySchema = createInsertSchema(mysteries).omit({
  id: true,
});

export const insertFamilySchema = createInsertSchema(families).omit({
  id: true,
  mysteriesSolved: true,
  totalPoints: true,
  createdAt: true,
});

export const insertGameSessionSchema = createInsertSchema(gameSession).omit({
  id: true,
  createdAt: true,
});

export type Character = typeof characters.$inferSelect;
export type Mystery = typeof mysteries.$inferSelect;
export type Family = typeof families.$inferSelect;
export type GameSession = typeof gameSession.$inferSelect;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type InsertMystery = z.infer<typeof insertMysterySchema>;
export type InsertFamily = z.infer<typeof insertFamilySchema>;
export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;
