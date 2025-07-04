import mongoose from 'mongoose';
import { MenuItem, Reservation, Testimonial, ContactMessage, type IMenuItem, type IReservation, type ITestimonial, type IContactMessage } from './models';
import type { IStorage } from './storage';
import type { MenuItem as DrizzleMenuItem, InsertMenuItem, Reservation as DrizzleReservation, InsertReservation, Testimonial as DrizzleTestimonial, InsertTestimonial, ContactMessage as DrizzleContactMessage, InsertContactMessage } from '@shared/schema';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

// Connect to MongoDB
export async function connectMongoDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB Atlas');
  }
}

// Helper function to convert MongoDB document to Drizzle format
function mongoToMenuItem(doc: any): DrizzleMenuItem {
  return {
    id: parseInt(doc._id.toString().slice(-6), 16), // Use last 6 chars of ObjectId
    name: doc.name,
    description: doc.description,
    price: doc.price,
    category: doc.category,
    image: doc.image,
    isSpicy: doc.isSpicy || null,
    isVegetarian: doc.isVegetarian || null,
    isPopular: doc.isPopular || null,
  };
}

function mongoToReservation(doc: any): DrizzleReservation {
  return {
    id: parseInt(doc._id.toString().slice(-6), 16),
    customerName: doc.customerName,
    email: doc.email,
    phone: doc.phone,
    date: doc.date,
    time: doc.time,
    partySize: doc.partySize,
    specialRequests: doc.specialRequests || null,
    status: doc.status || 'pending',
    createdAt: doc.createdAt || new Date(),
  };
}

function mongoToTestimonial(doc: any): DrizzleTestimonial {
  return {
    id: parseInt(doc._id.toString().slice(-6), 16),
    customerName: doc.customerName,
    rating: doc.rating,
    review: doc.review,
    date: doc.date,
    avatar: doc.avatar || null,
  };
}

function mongoToContactMessage(doc: any): DrizzleContactMessage {
  return {
    id: parseInt(doc._id.toString().slice(-6), 16),
    name: doc.name,
    email: doc.email,
    subject: doc.subject,
    message: doc.message,
    createdAt: doc.createdAt || new Date(),
  };
}

export class MongoStorage implements IStorage {
  constructor() {
    connectMongoDB().then(() => {
      this.initializeDefaultData();
    }).catch(console.error);
  }

  private async initializeDefaultData() {
    try {
      // Clear existing data and create fresh sample data
      await MenuItem.deleteMany({});
      console.log('Cleared existing menu items');

      // Create sample menu items
      const sampleMenuItems = [
        {
          name: "Döner Kebab",
          description: "Tender lamb and chicken döner served with rice, salad, and fresh bread",
          price: "₺85",
          category: "Ana Yemekler",
          image: "/api/placeholder/400/300",
          isPopular: true
        },
        {
          name: "Adana Kebab",
          description: "Spicy minced meat kebab grilled on skewers, served with bulgur pilaf",
          price: "₺95",
          category: "Ana Yemekler",
          image: "/api/placeholder/400/300",
          isSpicy: true
        },
        {
          name: "Lahmacun",
          description: "Turkish pizza with minced meat, vegetables, and herbs",
          price: "₺35",
          category: "Başlangıçlar",
          image: "/api/placeholder/400/300"
        },
        {
          name: "Çorbalar",
          description: "Daily fresh soup varieties",
          price: "₺25",
          category: "Çorbalar",
          image: "/api/placeholder/400/300"
        },
        {
          name: "Baklava",
          description: "Traditional Turkish dessert with pistachios and honey",
          price: "₺45",
          category: "Tatlılar",
          image: "/api/placeholder/400/300"
        },
        {
          name: "Çay",
          description: "Traditional Turkish tea",
          price: "₺15",
          category: "İçecekler",
          image: "/api/placeholder/400/300"
        }
      ];

      await MenuItem.insertMany(sampleMenuItems);
      console.log('Sample menu items created successfully');
    } catch (error) {
      console.error('Error initializing default data:', error);
    }
  }

  // Menu Items
  async getAllMenuItems(): Promise<DrizzleMenuItem[]> {
    await connectMongoDB();
    const items = await MenuItem.find({});
    return items.map(mongoToMenuItem);
  }

  async getMenuItem(id: number): Promise<DrizzleMenuItem | undefined> {
    await connectMongoDB();
    // Since we're using ObjectId, we need to find by a different approach
    const items = await MenuItem.find({});
    const item = items.find(item => parseInt(item._id.toString().slice(-6), 16) === id);
    return item ? mongoToMenuItem(item) : undefined;
  }

  async getMenuItemsByCategory(category: string): Promise<DrizzleMenuItem[]> {
    await connectMongoDB();
    const items = await MenuItem.find({ category });
    return items.map(mongoToMenuItem);
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<DrizzleMenuItem> {
    await connectMongoDB();
    const newItem = new MenuItem(insertItem);
    const savedItem = await newItem.save();
    return mongoToMenuItem(savedItem);
  }

  async updateMenuItem(id: number, updateData: Partial<InsertMenuItem>): Promise<DrizzleMenuItem> {
    await connectMongoDB();
    // Find by converted id approach
    const items = await MenuItem.find({});
    const item = items.find(item => parseInt(item._id.toString().slice(-6), 16) === id);
    
    if (!item) {
      throw new Error(`MenuItem with id ${id} not found`);
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(
      item._id,
      updateData,
      { new: true }
    );

    if (!updatedItem) {
      throw new Error(`Failed to update MenuItem with id ${id}`);
    }

    return mongoToMenuItem(updatedItem);
  }

  async deleteMenuItem(id: number): Promise<void> {
    await connectMongoDB();
    // Find by converted id approach
    const items = await MenuItem.find({});
    const item = items.find(item => parseInt(item._id.toString().slice(-6), 16) === id);
    
    if (!item) {
      throw new Error(`MenuItem with id ${id} not found`);
    }

    await MenuItem.findByIdAndDelete(item._id);
  }

  // Reservations
  async getAllReservations(): Promise<DrizzleReservation[]> {
    await connectMongoDB();
    const reservations = await Reservation.find({});
    return reservations.map(mongoToReservation);
  }

  async getReservation(id: number): Promise<DrizzleReservation | undefined> {
    await connectMongoDB();
    const reservations = await Reservation.find({});
    const reservation = reservations.find(res => parseInt(res._id.toString().slice(-6), 16) === id);
    return reservation ? mongoToReservation(reservation) : undefined;
  }

  async createReservation(insertReservation: InsertReservation): Promise<DrizzleReservation> {
    await connectMongoDB();
    const newReservation = new Reservation(insertReservation);
    const savedReservation = await newReservation.save();
    return mongoToReservation(savedReservation);
  }

  async updateReservationStatus(id: number, status: string): Promise<DrizzleReservation> {
    await connectMongoDB();
    const reservations = await Reservation.find({});
    const reservation = reservations.find(res => parseInt(res._id.toString().slice(-6), 16) === id);
    
    if (!reservation) {
      throw new Error(`Reservation with id ${id} not found`);
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservation._id,
      { status },
      { new: true }
    );

    if (!updatedReservation) {
      throw new Error(`Failed to update Reservation with id ${id}`);
    }

    return mongoToReservation(updatedReservation);
  }

  // Testimonials
  async getAllTestimonials(): Promise<DrizzleTestimonial[]> {
    await connectMongoDB();
    const testimonials = await Testimonial.find({});
    return testimonials.map(mongoToTestimonial);
  }

  async getTestimonial(id: number): Promise<DrizzleTestimonial | undefined> {
    await connectMongoDB();
    const testimonials = await Testimonial.find({});
    const testimonial = testimonials.find(test => parseInt(test._id.toString().slice(-6), 16) === id);
    return testimonial ? mongoToTestimonial(testimonial) : undefined;
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<DrizzleTestimonial> {
    await connectMongoDB();
    const newTestimonial = new Testimonial(insertTestimonial);
    const savedTestimonial = await newTestimonial.save();
    return mongoToTestimonial(savedTestimonial);
  }

  // Contact Messages
  async getAllContactMessages(): Promise<DrizzleContactMessage[]> {
    await connectMongoDB();
    const messages = await ContactMessage.find({});
    return messages.map(mongoToContactMessage);
  }

  async getContactMessage(id: number): Promise<DrizzleContactMessage | undefined> {
    await connectMongoDB();
    const messages = await ContactMessage.find({});
    const message = messages.find(msg => parseInt(msg._id.toString().slice(-6), 16) === id);
    return message ? mongoToContactMessage(message) : undefined;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<DrizzleContactMessage> {
    await connectMongoDB();
    const newMessage = new ContactMessage(insertMessage);
    const savedMessage = await newMessage.save();
    return mongoToContactMessage(savedMessage);
  }
}