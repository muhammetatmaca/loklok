import { 
  menuItems, 
  reservations, 
  testimonials, 
  contactMessages,
  galleryImages,
  aboutInfo,
  signatureCollection,
  type MenuItem, 
  type Reservation, 
  type Testimonial, 
  type ContactMessage,
  type GalleryImage,
  type AboutInfo,
  type SignatureCollection,
  type InsertMenuItem, 
  type InsertReservation, 
  type InsertTestimonial, 
  type InsertContactMessage,
  type InsertGalleryImage,
  type InsertAboutInfo,
  type InsertSignatureCollection
} from "@shared/schema";
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

  // Gallery Images
  getAllGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImage(id: number): Promise<GalleryImage | undefined>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: number, image: Partial<InsertGalleryImage>): Promise<GalleryImage>;
  deleteGalleryImage(id: number): Promise<void>;

  // About Info
  getAllAboutInfo(): Promise<AboutInfo[]>;
  getAboutInfo(id: number): Promise<AboutInfo | undefined>;
  getAboutInfoBySection(section: string): Promise<AboutInfo[]>;
  createAboutInfo(info: InsertAboutInfo): Promise<AboutInfo>;
  updateAboutInfo(id: number, info: Partial<InsertAboutInfo>): Promise<AboutInfo>;
  deleteAboutInfo(id: number): Promise<void>;

  // Signature Collection
  getAllSignatureCollection(): Promise<SignatureCollection[]>;
  getSignatureCollection(id: number): Promise<SignatureCollection | undefined>;
  createSignatureCollection(item: InsertSignatureCollection): Promise<SignatureCollection>;
  updateSignatureCollection(id: number, item: Partial<InsertSignatureCollection>): Promise<SignatureCollection>;
  deleteSignatureCollection(id: number): Promise<void>;
}



import { MongoStorage } from './mongo-storage';

export const storage = new MongoStorage();
