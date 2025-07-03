import { 
  characters, 
  mysteries, 
  families, 
  gameSession,
  type Character, 
  type Mystery, 
  type Family, 
  type GameSession,
  type InsertCharacter, 
  type InsertMystery, 
  type InsertFamily, 
  type InsertGameSession 
} from "@shared/schema";

export interface IStorage {
  // Characters
  getAllCharacters(): Promise<Character[]>;
  getCharacter(id: number): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;

  // Mysteries
  getAllMysteries(): Promise<Mystery[]>;
  getMystery(id: number): Promise<Mystery | undefined>;
  createMystery(mystery: InsertMystery): Promise<Mystery>;

  // Families
  getAllFamilies(): Promise<Family[]>;
  getFamily(id: number): Promise<Family | undefined>;
  createFamily(family: InsertFamily): Promise<Family>;
  updateFamilyScore(id: number, mysteriesSolved: number, points: number): Promise<Family>;

  // Game Sessions
  createGameSession(session: InsertGameSession): Promise<GameSession>;
  getGameSession(id: number): Promise<GameSession | undefined>;
  updateGameSession(id: number, updates: Partial<GameSession>): Promise<GameSession>;
}

export class MemStorage implements IStorage {
  private characters: Map<number, Character>;
  private mysteries: Map<number, Mystery>;
  private families: Map<number, Family>;
  private gameSessions: Map<number, GameSession>;
  private currentCharacterId: number;
  private currentMysteryId: number;
  private currentFamilyId: number;
  private currentGameSessionId: number;

  constructor() {
    this.characters = new Map();
    this.mysteries = new Map();
    this.families = new Map();
    this.gameSessions = new Map();
    this.currentCharacterId = 1;
    this.currentMysteryId = 1;
    this.currentFamilyId = 1;
    this.currentGameSessionId = 1;

    // Initialize with default data
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    // Default characters
    await this.createCharacter({
      name: "Detective Sam",
      title: "The Clue Finder",
      ability: "Can find hidden clues that others miss",
      description: "Sam has a keen eye for detail and can spot clues in the most unexpected places.",
      icon: "fas fa-search",
      color: "mystery-yellow"
    });

    await this.createCharacter({
      name: "Professor Lily",
      title: "The Puzzle Solver",
      ability: "Excellent at solving riddles and puzzles",
      description: "Lily's analytical mind makes her perfect for cracking codes and solving complex puzzles.",
      icon: "fas fa-lightbulb",
      color: "mystery-green"
    });

    await this.createCharacter({
      name: "Captain Max",
      title: "The Interviewer",
      ability: "Gets more information from witnesses",
      description: "Max's friendly personality helps him get important information from people.",
      icon: "fas fa-comments",
      color: "mystery-purple"
    });

    await this.createCharacter({
      name: "Scout Emma",
      title: "The Observer",
      ability: "Notices details others overlook",
      description: "Emma's sharp observation skills help her notice important details in any situation.",
      icon: "fas fa-eye",
      color: "mystery-coral"
    });

    // Default mysteries
    await this.createMystery({
      title: "The Missing Cookie Mystery",
      description: "Someone took the last cookie from the jar. Can you find out who?",
      difficulty: 2,
      ageRange: "Ages 4-8",
      maxPlayers: 4,
      icon: "fas fa-home",
      solved: false
    });

    await this.createMystery({
      title: "The Playground Puzzle",
      description: "The playground equipment is acting strange. Investigate the mystery!",
      difficulty: 3,
      ageRange: "Ages 6-12",
      maxPlayers: 5,
      icon: "fas fa-school",
      solved: false
    });

    await this.createMystery({
      title: "The Castle Secret",
      description: "Explore the mysterious castle and uncover its hidden secrets!",
      difficulty: 3,
      ageRange: "Ages 8+",
      maxPlayers: 6,
      icon: "fas fa-castle",
      solved: false
    });

    // Default families for leaderboard
    await this.createFamily({ name: "The Johnson Family" });
    await this.updateFamilyScore(1, 15, 1250);
    
    await this.createFamily({ name: "The Garcia Squad" });
    await this.updateFamilyScore(2, 12, 980);
    
    await this.createFamily({ name: "Team Rodriguez" });
    await this.updateFamilyScore(3, 10, 750);
  }

  async getAllCharacters(): Promise<Character[]> {
    return Array.from(this.characters.values());
  }

  async getCharacter(id: number): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const id = this.currentCharacterId++;
    const character: Character = { ...insertCharacter, id };
    this.characters.set(id, character);
    return character;
  }

  async getAllMysteries(): Promise<Mystery[]> {
    return Array.from(this.mysteries.values());
  }

  async getMystery(id: number): Promise<Mystery | undefined> {
    return this.mysteries.get(id);
  }

  async createMystery(insertMystery: InsertMystery): Promise<Mystery> {
    const id = this.currentMysteryId++;
    const mystery: Mystery = { ...insertMystery, id };
    this.mysteries.set(id, mystery);
    return mystery;
  }

  async getAllFamilies(): Promise<Family[]> {
    return Array.from(this.families.values()).sort((a, b) => b.totalPoints - a.totalPoints);
  }

  async getFamily(id: number): Promise<Family | undefined> {
    return this.families.get(id);
  }

  async createFamily(insertFamily: InsertFamily): Promise<Family> {
    const id = this.currentFamilyId++;
    const family: Family = { 
      ...insertFamily, 
      id, 
      mysteriesSolved: 0, 
      totalPoints: 0,
      createdAt: new Date()
    };
    this.families.set(id, family);
    return family;
  }

  async updateFamilyScore(id: number, mysteriesSolved: number, points: number): Promise<Family> {
    const family = this.families.get(id);
    if (!family) {
      throw new Error(`Family with id ${id} not found`);
    }
    
    const updatedFamily: Family = {
      ...family,
      mysteriesSolved,
      totalPoints: points
    };
    
    this.families.set(id, updatedFamily);
    return updatedFamily;
  }

  async createGameSession(insertSession: InsertGameSession): Promise<GameSession> {
    const id = this.currentGameSessionId++;
    const session: GameSession = {
      ...insertSession,
      id,
      currentStep: 0,
      cluesFound: [],
      isCompleted: false,
      createdAt: new Date()
    };
    this.gameSessions.set(id, session);
    return session;
  }

  async getGameSession(id: number): Promise<GameSession | undefined> {
    return this.gameSessions.get(id);
  }

  async updateGameSession(id: number, updates: Partial<GameSession>): Promise<GameSession> {
    const session = this.gameSessions.get(id);
    if (!session) {
      throw new Error(`Game session with id ${id} not found`);
    }
    
    const updatedSession: GameSession = { ...session, ...updates };
    this.gameSessions.set(id, updatedSession);
    return updatedSession;
  }
}

export const storage = new MemStorage();
