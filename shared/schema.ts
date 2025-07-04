import { pgTable, text, serial, integer, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  isSpicy: boolean("is_spicy").default(false),
  isVegetarian: boolean("is_vegetarian").default(false),
  isPopular: boolean("is_popular").default(false),
});

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  partySize: integer("party_size").notNull(),
  specialRequests: text("special_requests"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  rating: integer("rating").notNull(), // 1-5
  review: text("review").notNull(),
  date: text("date").notNull(),
  avatar: text("avatar"),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Gallery table
export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  category: text("category"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// About us/Company info table  
export const aboutInfo = pgTable("about_info", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  section: text("section").notNull(), // 'history', 'mission', 'team', etc.
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const signatureCollection = pgTable("signature_collection", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
});

export const insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export const insertGalleryImageSchema = createInsertSchema(galleryImages).omit({
  id: true,
  createdAt: true,
});

export const insertAboutInfoSchema = createInsertSchema(aboutInfo).omit({
  id: true,
  updatedAt: true,
});

export const insertSignatureCollectionSchema = createInsertSchema(signatureCollection).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type MenuItem = typeof menuItems.$inferSelect;
export type Reservation = typeof reservations.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type AboutInfo = typeof aboutInfo.$inferSelect;
export type SignatureCollection = typeof signatureCollection.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type InsertAboutInfo = z.infer<typeof insertAboutInfoSchema>;
export type InsertSignatureCollection = z.infer<typeof insertSignatureCollectionSchema>;
