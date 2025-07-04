import { 
  menuItems, 
  reservations, 
  testimonials, 
  contactMessages,
  type MenuItem, 
  type Reservation, 
  type Testimonial, 
  type ContactMessage,
  type InsertMenuItem, 
  type InsertReservation, 
  type InsertTestimonial, 
  type InsertContactMessage 
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Menu Items
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem>;
  deleteMenuItem(id: number): Promise<void>;

  // Reservations
  getAllReservations(): Promise<Reservation[]>;
  getReservation(id: number): Promise<Reservation | undefined>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservationStatus(id: number, status: string): Promise<Reservation>;

  // Testimonials
  getAllTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;

  // Contact Messages
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private menuItems: Map<number, MenuItem>;
  private reservations: Map<number, Reservation>;
  private testimonials: Map<number, Testimonial>;
  private contactMessages: Map<number, ContactMessage>;
  private currentMenuItemId: number;
  private currentReservationId: number;
  private currentTestimonialId: number;
  private currentContactMessageId: number;

  constructor() {
    this.menuItems = new Map();
    this.reservations = new Map();
    this.testimonials = new Map();
    this.contactMessages = new Map();
    this.currentMenuItemId = 1;
    this.currentReservationId = 1;
    this.currentTestimonialId = 1;
    this.currentContactMessageId = 1;

    // Initialize with default data
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    // Default menu items
    await this.createMenuItem({
      name: "Döner Kebab",
      description: "Tender lamb and chicken carved from our traditional vertical rotisserie, served with fresh vegetables and our signature sauce",
      price: "24.99",
      category: "Döner",
      image: "/images/doner-kebab.jpg",
      isSpicy: false,
      isVegetarian: false,
      isPopular: true
    });

    await this.createMenuItem({
      name: "Adana Kebab",
      description: "Spicy hand-minced lamb grilled to perfection on skewers, served with grilled vegetables and rice",
      price: "28.99",
      category: "Grilled",
      image: "/images/adana-kebab.jpg",
      isSpicy: true,
      isVegetarian: false,
      isPopular: true
    });

    await this.createMenuItem({
      name: "Iskender Kebab",
      description: "Sliced döner served over toasted bread with tomato sauce, yogurt, and melted butter",
      price: "32.99",
      category: "Döner",
      image: "/images/iskender-kebab.jpg",
      isSpicy: false,
      isVegetarian: false,
      isPopular: true
    });

    await this.createMenuItem({
      name: "Lahmacun",
      description: "Turkish pizza topped with minced meat, vegetables, and herbs, baked in our stone oven",
      price: "16.99",
      category: "Appetizers",
      image: "/images/lahmacun.jpg",
      isSpicy: false,
      isVegetarian: false,
      isPopular: false
    });

    await this.createMenuItem({
      name: "Baklava",
      description: "Traditional Turkish dessert made with layers of phyllo pastry, nuts, and honey syrup",
      price: "8.99",
      category: "Desserts",
      image: "/images/baklava.jpg",
      isSpicy: false,
      isVegetarian: true,
      isPopular: true
    });

    await this.createMenuItem({
      name: "Turkish Tea",
      description: "Authentic Turkish black tea served in traditional tulip-shaped glasses",
      price: "4.99",
      category: "Beverages",
      image: "/images/turkish-tea.jpg",
      isSpicy: false,
      isVegetarian: true,
      isPopular: false
    });

    // Default testimonials
    await this.createTestimonial({
      customerName: "Sarah Johnson",
      rating: 5,
      review: "The best döner I've ever had! The meat is so tender and the flavors are incredible. The atmosphere is warm and welcoming.",
      date: "2024-01-15",
      avatar: "/images/avatars/sarah.jpg"
    });

    await this.createTestimonial({
      customerName: "Michael Chen",
      rating: 5,
      review: "Authentic Turkish cuisine at its finest. The Iskender kebab is absolutely divine, and the service is exceptional.",
      date: "2024-01-10",
      avatar: "/images/avatars/michael.jpg"
    });

    await this.createTestimonial({
      customerName: "Emily Rodriguez",
      rating: 4,
      review: "Great food and atmosphere! The döner is perfectly seasoned and the staff is very friendly. Will definitely be back!",
      date: "2024-01-08",
      avatar: "/images/avatars/emily.jpg"
    });
  }

  // Menu Items
  async getAllMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => item.category === category);
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentMenuItemId++;
    const item: MenuItem = { 
      ...insertItem, 
      id,
      isSpicy: insertItem.isSpicy ?? null,
      isVegetarian: insertItem.isVegetarian ?? null,
      isPopular: insertItem.isPopular ?? null
    };
    this.menuItems.set(id, item);
    return item;
  }

  async updateMenuItem(id: number, updateData: Partial<InsertMenuItem>): Promise<MenuItem> {
    const existingItem = this.menuItems.get(id);
    if (!existingItem) {
      throw new Error(`MenuItem with id ${id} not found`);
    }
    
    const updatedItem: MenuItem = {
      ...existingItem,
      ...updateData,
      isSpicy: updateData.isSpicy ?? existingItem.isSpicy,
      isVegetarian: updateData.isVegetarian ?? existingItem.isVegetarian,
      isPopular: updateData.isPopular ?? existingItem.isPopular
    };
    this.menuItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteMenuItem(id: number): Promise<void> {
    if (!this.menuItems.has(id)) {
      throw new Error(`MenuItem with id ${id} not found`);
    }
    this.menuItems.delete(id);
  }

  // Reservations
  async getAllReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getReservation(id: number): Promise<Reservation | undefined> {
    return this.reservations.get(id);
  }

  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const id = this.currentReservationId++;
    const reservation: Reservation = { 
      ...insertReservation, 
      id,
      status: "pending",
      createdAt: new Date(),
      specialRequests: insertReservation.specialRequests ?? null
    };
    this.reservations.set(id, reservation);
    return reservation;
  }

  async updateReservationStatus(id: number, status: string): Promise<Reservation> {
    const reservation = this.reservations.get(id);
    if (!reservation) {
      throw new Error(`Reservation with id ${id} not found`);
    }
    
    const updatedReservation: Reservation = {
      ...reservation,
      status
    };
    
    this.reservations.set(id, updatedReservation);
    return updatedReservation;
  }

  // Testimonials
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentTestimonialId++;
    const testimonial: Testimonial = { 
      ...insertTestimonial, 
      id,
      avatar: insertTestimonial.avatar ?? null
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  // Contact Messages
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessages.get(id);
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactMessageId++;
    const message: ContactMessage = { 
      ...insertMessage, 
      id,
      createdAt: new Date()
    };
    this.contactMessages.set(id, message);
    return message;
  }
}

export class DatabaseStorage implements IStorage {
  // Menu Items
  async getAllMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems);
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return item;
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return await db.select().from(menuItems).where(eq(menuItems.category, category));
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const [item] = await db.insert(menuItems).values(insertItem).returning();
    return item;
  }

  async updateMenuItem(id: number, updateData: Partial<InsertMenuItem>): Promise<MenuItem> {
    const [item] = await db.update(menuItems)
      .set(updateData)
      .where(eq(menuItems.id, id))
      .returning();
    return item;
  }

  async deleteMenuItem(id: number): Promise<void> {
    await db.delete(menuItems).where(eq(menuItems.id, id));
  }

  // Reservations
  async getAllReservations(): Promise<Reservation[]> {
    return await db.select().from(reservations);
  }

  async getReservation(id: number): Promise<Reservation | undefined> {
    const [reservation] = await db.select().from(reservations).where(eq(reservations.id, id));
    return reservation;
  }

  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const [reservation] = await db.insert(reservations).values(insertReservation).returning();
    return reservation;
  }

  async updateReservationStatus(id: number, status: string): Promise<Reservation> {
    const [reservation] = await db.update(reservations)
      .set({ status })
      .where(eq(reservations.id, id))
      .returning();
    return reservation;
  }

  // Testimonials
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial;
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values(insertTestimonial).returning();
    return testimonial;
  }

  // Contact Messages
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages);
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return message;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db.insert(contactMessages).values(insertMessage).returning();
    return message;
  }
}

import { MongoStorage } from './mongo-storage';

export const storage = new MongoStorage();
