import mongoose from 'mongoose';

// MenuItem Schema
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  isSpicy: { type: Boolean, default: false },
  isVegetarian: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
}, { timestamps: true });

// Reservation Schema
const reservationSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  partySize: { type: Number, required: true },
  specialRequests: { type: String },
  status: { type: String, default: 'pending' },
}, { timestamps: true });

// Testimonial Schema
const testimonialSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  date: { type: String, required: true },
  avatar: { type: String },
}, { timestamps: true });

// Contact Message Schema
const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

// Export models
export const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
export const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);
export const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
export const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);

// Types
export interface IMenuItem {
  _id?: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isPopular?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReservation {
  _id?: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  specialRequests?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITestimonial {
  _id?: string;
  customerName: string;
  rating: number;
  review: string;
  date: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IContactMessage {
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}