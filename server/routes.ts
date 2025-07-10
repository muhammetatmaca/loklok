import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReservationSchema, insertContactMessageSchema, insertMenuItemSchema, insertSignatureCollectionSchema } from "@shared/schema";
import { z } from "zod";
import CloudinaryService from "./cloudinary";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";

// Admin credentials (in production, store these securely)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "zafer123";
const JWT_SECRET = process.env.JWT_SECRET || "zafer-restaurant-secret-key";

// Extend Request interface for user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Authentication middleware
const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.redirect("/admin/login"); // Token yoksa login sayfasına yönlendir
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.redirect("/admin/login"); // Geçersiz token varsa yine login'e at
    }
};


export async function registerRoutes(app: Express): Promise<Server> {
  // Admin Login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { username: ADMIN_USERNAME, role: "admin" },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({ token, message: "Login successful" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Menu Items routes
    app.get("/api/menu", async (req, res) => {
        try {
            const { category } = req.query;
            let menuItems;

            if (category && typeof category === "string") {
                menuItems = await storage.getMenuItemsByCategory(category);
            } else {
                menuItems = await storage.getAllMenuItems();
            }
            console.log(menuItems)
            res.json(menuItems);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("API /api/menu error:", error.message);
                res.status(500).json({ error: "Failed to fetch menu items", details: error.message });
            } else {
                console.error("API /api/menu error (unknown):", error);
                res.status(500).json({ error: "Failed to fetch menu items", details: "Unknown error" });
            }
        }
    });



  app.get("/api/menu/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const menuItem = await storage.getMenuItem(id);
      if (!menuItem) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json(menuItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu item" });
    }
  });

  // Reservations routes
  app.get("/api/reservations", async (req, res) => {
    try {
      const reservations = await storage.getAllReservations();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reservations" });
    }
  });

  app.post("/api/reservations", async (req, res) => {
    try {
      const validatedData = insertReservationSchema.parse(req.body);
      const reservation = await storage.createReservation(validatedData);
      res.status(201).json(reservation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid reservation data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create reservation" });
    }
  });

  app.patch("/api/reservations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const reservation = await storage.updateReservationStatus(id, status);
      res.json(reservation);
    } catch (error) {
      res.status(500).json({ error: "Failed to update reservation" });
    }
  });

  // Testimonials routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  // Contact Messages routes
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid contact data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.get("/api/contact", async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact messages" });
    }
  });

  // Admin Routes (Protected)
    app.post('/api/admin/menu', authenticateAdmin, async (req, res) => {
        try {
            console.log('Received menu data:', req.body);
            const data = insertMenuItemSchema.parse(req.body);
            const menuItem = await storage.createMenuItem(data);
            res.json(menuItem);
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.log('Validation error:', error.errors);
                res.status(400).json({ error: error.errors });
            } else {
                console.log('Server error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    });

  app.put('/api/admin/menu/:id', authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertMenuItemSchema.partial().parse(req.body);
      const menuItem = await storage.updateMenuItem(id, data);
      res.json(menuItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  app.delete('/api/admin/menu/:id', authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMenuItem(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Gallery Images API
  app.get("/api/gallery", async (req, res) => {
    try {
      const images = await storage.getAllGalleryImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      res.status(500).json({ error: "Failed to fetch gallery images" });
    }
  });

  app.post("/api/admin/gallery", async (req, res) => {
    try {
      const image = await storage.createGalleryImage(req.body);
      res.json(image);
    } catch (error) {
      console.error("Error creating gallery image:", error);
      res.status(500).json({ error: "Failed to create gallery image" });
    }
  });

  app.put("/api/admin/gallery/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const image = await storage.updateGalleryImage(id, req.body);
      res.json(image);
    } catch (error) {
      console.error("Error updating gallery image:", error);
      res.status(500).json({ error: "Failed to update gallery image" });
    }
  });

  app.delete("/api/admin/gallery/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteGalleryImage(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      res.status(500).json({ error: "Failed to delete gallery image" });
    }
  });

  // About Info API
  app.get("/api/about", async (req, res) => {
    try {
      const section = req.query.section as string;
      let aboutInfo;
      if (section) {
        aboutInfo = await storage.getAboutInfoBySection(section);
      } else {
        aboutInfo = await storage.getAllAboutInfo();
      }
      res.json(aboutInfo);
    } catch (error) {
      console.error("Error fetching about info:", error);
      res.status(500).json({ error: "Failed to fetch about info" });
    }
  });

  app.post("/api/admin/about", async (req, res) => {
    try {
      const info = await storage.createAboutInfo(req.body);
      res.json(info);
    } catch (error) {
      console.error("Error creating about info:", error);
      res.status(500).json({ error: "Failed to create about info" });
    }
  });

  app.put("/api/admin/about/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const info = await storage.updateAboutInfo(id, req.body);
      res.json(info);
    } catch (error) {
      console.error("Error updating about info:", error);
      res.status(500).json({ error: "Failed to update about info" });
    }
  });

  app.delete("/api/admin/about/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAboutInfo(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting about info:", error);
      res.status(500).json({ error: "Failed to delete about info" });
    }
  });

  // Testimonials API
  app.post("/api/admin/testimonials", async (req, res) => {
    try {
      const testimonial = await storage.createTestimonial(req.body);
      res.json(testimonial);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(500).json({ error: "Failed to create testimonial" });
    }
  });

  app.put("/api/admin/testimonials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const testimonial = await storage.updateTestimonial(id, req.body);
      res.json(testimonial);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(500).json({ error: "Failed to update testimonial" });
    }
  });

  app.delete("/api/admin/testimonials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTestimonial(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ error: "Failed to delete testimonial" });
    }
  });

  // Cloudinary Upload Endpoints
    app.post("/api/upload/image", async (req, res) => {
        try {
            const { base64, folder } = req.body;
            console.log("Upload request received", folder);

            if (!base64) {
                return res.status(400).json({ error: "Base64 image data required" });
            }

            const result = await CloudinaryService.uploadFromBase64(
                base64,
                folder || "zafer-restaurant"
            );

            const response = {
                public_id: result.public_id,
                secure_url: result.secure_url,
                url: result.secure_url // sadece orijinal link
            };

            console.log("API response:", response);
            res.json(response);
        } catch (error) {
            console.error("Error uploading image:", error);
            res.status(500).json({ error: "Failed to upload image" });
        }
    });

    app.post("/api/upload/url", async (req, res) => {
        try {
            const { url, folder } = req.body;

            if (!url) {
                return res.status(400).json({ error: "Image URL required" });
            }

            const result = await CloudinaryService.uploadFromUrl(
                url,
                folder || "zafer-restaurant"
            );

            res.json({
                public_id: result.public_id,
                secure_url: result.secure_url,
                url: result.secure_url
            });
        } catch (error) {
            console.error("Error uploading image from URL:", error);
            res.status(500).json({ error: "Failed to upload image from URL" });
        }
    });

  app.delete("/api/upload/:publicId", async (req, res) => {
    try {
      const { publicId } = req.params;
      
      if (!publicId) {
        return res.status(400).json({ error: "Public ID required" });
      }

      // URL decode the public ID
      const decodedPublicId = decodeURIComponent(publicId);
      
      await CloudinaryService.deleteImage(decodedPublicId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ error: "Failed to delete image" });
    }
  });

  // Signature Collection endpoints
  app.get("/api/signature-collection", async (req, res) => {
    try {
        const items = await storage.getAllSignatureCollection();

      res.json(items);
    } catch (error) {
      console.error("Error fetching signature collection:", error);
      res.status(500).json({ error: "Failed to fetch signature collection" });
    }
  });

  app.get("/api/signature-collection/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getSignatureCollection(id);
      if (!item) {
        return res.status(404).json({ error: "Signature collection item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching signature collection item:", error);
      res.status(500).json({ error: "Failed to fetch signature collection item" });
    }
  });

    // Ekleme (Create)
    app.post("/api/signature-collection", async (req, res) => {
        try {
            const parsed = insertSignatureCollectionSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
            }

            const item = await storage.createSignatureCollection(parsed.data);
            res.status(201).json(item);
        } catch (error) {
            console.error("Error creating signature collection item:", error);
            res.status(500).json({ error: "Failed to create signature collection item" });
        }
    });

    // Güncelleme (Update)
    app.put("/api/signature-collection/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id); // 🔧 doğru değişken adı
            const parsed = insertSignatureCollectionSchema.partial().safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
            }

            const item = await storage.updateSignatureCollection(id, parsed.data);
            res.json(item);
        } catch (error) {
            console.error("Error updating signature collection item:", error);
            res.status(500).json({ error: "Failed to update signature collection item" });
        }
    });

    // Silme (Delete)
    app.delete("/api/signature-collection/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            await storage.deleteSignatureCollection(id);
            res.json({ success: true });
        } catch (error) {
            console.error("Error deleting signature collection item:", error);
            res.status(500).json({ error: "Failed to delete signature collection item" });
        }
    });


  const httpServer = createServer(app);
  return httpServer;
}
