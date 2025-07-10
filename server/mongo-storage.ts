import 'dotenv/config'; // En üst satırlarda olmalı!
import mongoose from 'mongoose';
import { MenuItem, Reservation, Testimonial, ContactMessage, GalleryImage, AboutInfo, SignatureCollection, type IMenuItem, type IReservation, type ITestimonial, type IContactMessage, type IGalleryImage, type IAboutInfo, type ISignatureCollection } from './models';
import type { IStorage } from './storage';
import { type MenuItem as DrizzleMenuItem, type InsertMenuItem, type Reservation as DrizzleReservation, type InsertReservation, type Testimonial as DrizzleTestimonial, type InsertTestimonial, type ContactMessage as DrizzleContactMessage, type InsertContactMessage, type GalleryImage as DrizzleGalleryImage, type InsertGalleryImage, type AboutInfo as DrizzleAboutInfo, type InsertAboutInfo, type SignatureCollection as DrizzleSignatureCollection, type InsertSignatureCollection, signatureCollection } from '@shared/schema';

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

function mongoToGalleryImage(doc: any): DrizzleGalleryImage {
  return {
    id: parseInt(doc._id.toString().slice(-6), 16),
    title: doc.title,
    description: doc.description || null,
    imageUrl: doc.imageUrl,
    category: doc.category || null,
    isActive: doc.isActive !== false,
    createdAt: doc.createdAt || new Date(),
  };
}

function mongoToAboutInfo(doc: any): DrizzleAboutInfo {
  return {
    id: parseInt(doc._id.toString().slice(-6), 16),
    title: doc.title,
    content: doc.content,
    imageUrl: doc.imageUrl || null,
    section: doc.section,
    displayOrder: doc.displayOrder || 0,
    isActive: doc.isActive !== false,
    updatedAt: doc.updatedAt || new Date(),
  };
}

function mongoToSignatureCollection(doc: any): DrizzleSignatureCollection {
  return {
    id: parseInt(doc._id.toString().slice(-6), 16),
    title: doc.title,
    description: doc.description,
    image: doc.image,
    displayOrder: doc.displayOrder || null,
    isActive: doc.isActive !== false,
    createdAt: doc.createdAt || null,
    updatedAt: doc.updatedAt || null,
  };
}

export class MongoStorage implements IStorage {
  constructor() {
    connectMongoDB().then(() => {
    }).catch(console.error);
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

  // Gallery Images
  async getAllGalleryImages(): Promise<DrizzleGalleryImage[]> {
    await connectMongoDB();
    const images = await GalleryImage.find({ isActive: true }).sort({ createdAt: -1 });
    return images.map(mongoToGalleryImage);
  }

  async getGalleryImage(id: number): Promise<DrizzleGalleryImage | undefined> {
    await connectMongoDB();
    const images = await GalleryImage.find({});
    const image = images.find(img => parseInt(img._id.toString().slice(-6), 16) === id);
    return image ? mongoToGalleryImage(image) : undefined;
  }

  async createGalleryImage(insertImage: InsertGalleryImage): Promise<DrizzleGalleryImage> {
    await connectMongoDB();
    const newImage = new GalleryImage(insertImage);
    const savedImage = await newImage.save();
    return mongoToGalleryImage(savedImage);
  }

  async updateGalleryImage(id: number, updateData: Partial<InsertGalleryImage>): Promise<DrizzleGalleryImage> {
    await connectMongoDB();
    const images = await GalleryImage.find({});
    const image = images.find(img => parseInt(img._id.toString().slice(-6), 16) === id);
    
    if (!image) {
      throw new Error(`GalleryImage with id ${id} not found`);
    }

    const updatedImage = await GalleryImage.findByIdAndUpdate(
      image._id,
      updateData,
      { new: true }
    );

    if (!updatedImage) {
      throw new Error(`Failed to update GalleryImage with id ${id}`);
    }

    return mongoToGalleryImage(updatedImage);
  }

  async deleteGalleryImage(id: number): Promise<void> {
    await connectMongoDB();
    const images = await GalleryImage.find({});
    const image = images.find(img => parseInt(img._id.toString().slice(-6), 16) === id);
    
    if (!image) {
      throw new Error(`GalleryImage with id ${id} not found`);
    }

    await GalleryImage.findByIdAndDelete(image._id);
  }

  // About Info
  async getAllAboutInfo(): Promise<DrizzleAboutInfo[]> {
    await connectMongoDB();
    const aboutInfos = await AboutInfo.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
    return aboutInfos.map(mongoToAboutInfo);
  }

  async getAboutInfo(id: number): Promise<DrizzleAboutInfo | undefined> {
    await connectMongoDB();
    const aboutInfos = await AboutInfo.find({});
    const aboutInfo = aboutInfos.find(info => parseInt(info._id.toString().slice(-6), 16) === id);
    return aboutInfo ? mongoToAboutInfo(aboutInfo) : undefined;
  }

  async getAboutInfoBySection(section: string): Promise<DrizzleAboutInfo[]> {
    await connectMongoDB();
    const aboutInfos = await AboutInfo.find({ section, isActive: true }).sort({ displayOrder: 1 });
    return aboutInfos.map(mongoToAboutInfo);
  }
   
  async createAboutInfo(insertInfo: InsertAboutInfo): Promise<DrizzleAboutInfo> {
    await connectMongoDB();
    const newInfo = new AboutInfo(insertInfo);
    const savedInfo = await newInfo.save();
    return mongoToAboutInfo(savedInfo);
  }

  async updateAboutInfo(id: number, updateData: Partial<InsertAboutInfo>): Promise<DrizzleAboutInfo> {
    await connectMongoDB();
    const aboutInfos = await AboutInfo.find({});
    const aboutInfo = aboutInfos.find(info => parseInt(info._id.toString().slice(-6), 16) === id);
    
    if (!aboutInfo) {
      throw new Error(`AboutInfo with id ${id} not found`);
    }

    const updatedInfo = await AboutInfo.findByIdAndUpdate(
      aboutInfo._id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedInfo) {
      throw new Error(`Failed to update AboutInfo with id ${id}`);
    }

    return mongoToAboutInfo(updatedInfo);
  }

  async deleteAboutInfo(id: number): Promise<void> {
    await connectMongoDB();
    const aboutInfos = await AboutInfo.find({});
    const aboutInfo = aboutInfos.find(info => parseInt(info._id.toString().slice(-6), 16) === id);
    
    if (!aboutInfo) {
      throw new Error(`AboutInfo with id ${id} not found`);
    }

    await AboutInfo.findByIdAndDelete(aboutInfo._id);
  }

  // Missing Testimonial methods
    async updateTestimonial(id: number, updateData: Partial<InsertTestimonial>): Promise<DrizzleTestimonial> {
        await connectMongoDB();
        // Find by converted id approach
        const items = await Testimonial.find({});
        const item = items.find(item => parseInt(item._id.toString().slice(-6), 16) === id);



        const updatedItem = await Testimonial.findByIdAndUpdate(
            item._id,
            updateData,
            { new: true }
        );

    
        if (!updatedItem) {
      throw new Error(`Testimonial with id ${id} not found`);
    }

        Object.assign(updatedItem, updateData, { updatedAt: new Date() });
        await updatedItem.save();

        return mongoToTestimonial(updatedItem);
  }

  async deleteTestimonial(id: number): Promise<void> {

      await connectMongoDB();
      // Find by converted id approach
      const items = await Testimonial.find({});
      const item = items.find(item => parseInt(item._id.toString().slice(-6), 16) === id);
    
      if (!item) {
      throw new Error(`Testimonial with id ${id} not found`);
    }

      await Testimonial.findByIdAndDelete(item._id);
  }

  // Signature Collection operations
  async getAllSignatureCollection(): Promise<DrizzleSignatureCollection[]> {
    const items = await SignatureCollection.find({ isActive: true }).sort({ displayOrder: 1 });
    return items.map(mongoToSignatureCollection);
  }

  async getSignatureCollection(id: number): Promise<DrizzleSignatureCollection | undefined> {
    const item = await SignatureCollection.findOne({ id });
    return item ? mongoToSignatureCollection(item) : undefined;
  }

    async createSignatureCollection(insertItem: InsertSignatureCollection): Promise<DrizzleSignatureCollection> {

    const id = Math.floor(Math.random() * 1000000); // Generate random ID
    const item = new SignatureCollection({
      id,
      ...insertItem,
    });
    await item.save();
    return mongoToSignatureCollection(item);
  }

    async updateSignatureCollection(id: number, updateData: Partial<InsertSignatureCollection>): Promise<DrizzleSignatureCollection> {


        await connectMongoDB();
        // Find by converted id approach
        const items = await SignatureCollection.find({});
        const item = items.find(item => parseInt(item._id.toString().slice(-6), 16) === id);

      

        const updatedItem = await SignatureCollection.findByIdAndUpdate(
            item._id,
            updateData,
            { new: true }
        );

      


        if (!item) {
            throw new Error(`MenuItem with id ${id} not found`);
        }
    
        return mongoToSignatureCollection(updatedItem);
  }

    async deleteSignatureCollection(id: number): Promise<void> {
        await connectMongoDB();
        // Find by converted id approach
        const items = await SignatureCollection.find({});
      const item = items.find(item => parseInt(item._id.toString().slice(-6), 16) === id);
    
    if (!item) {
      throw new Error(`Signature collection with id ${id} not found`);
    }

    await SignatureCollection.findByIdAndDelete(item._id);
  }
}