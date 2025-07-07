import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { GalleryImage } from "@shared/schema";
import zaferLogo from "@assets/ChatGPT Image 4 Tem 2025 03_51_43_1751590317642.png";
import MobileBottomNav from "@/components/mobile-bottom-nav";

export default function Gallery() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("Hepsi");

  const { data: galleryItems, isLoading } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });

  // Get unique categories
  const uniqueCategories = galleryItems ? 
    galleryItems.reduce((cats: string[], item) => {
      if (item.category && !cats.includes(item.category)) {
        cats.push(item.category);
      }
      return cats;
    }, []) : [];
    const categories = ["Hepsi", ...uniqueCategories];



  if (isLoading) {
    return (
      <div className="min-h-screen bg-zafer-surface flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-3 border-zafer-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Fallback for empty gallery
  const placeholderItems = [
    {
      id: 1,
      title: "Döner Kebab",
      category: "Yemekler",
      description: "Geleneksel döner kebabımızın enfes görünümü",
      imageUrl:""
    },
    {
      id: 2,
      title: "Iskender Kebab",
      category: "Yemekler", 
      description: "Özel sosumuzla hazırlanan Iskender kebab"
    },
    {
      id: 3,
      title: "Restoran İç Mekan",
      category: "Restoran",
      description: "Modern ve sıcak atmosferimiz"
    },
    {
      id: 4,
      title: "Açık Mutfak",
      category: "Mutfak",
      description: "Temiz ve modern mutfağımız"
    },
    {
      id: 5,
      title: "Adana Kebab",
      category: "Yemekler",
      description: "Acı sevenlerin vazgeçilmezi"
    },
    {
      id: 6,
      title: "Baklava",
      category: "Yemekler",
      description: "Ev yapımı taze baklava"
    },
    {
      id: 7,
      title: "Özel Etkinlik",
      category: "Etkinlikler",
      description: "Düğün ve özel günleriniz için"
    },
    {
      id: 8,
      title: "Terras Alanı",
      category: "Restoran",
      description: "Açık hava yemek keyfi"
    },
    {
      id: 9,
      title: "Pide Hazırlığı",
      category: "Mutfak",
      description: "Usta ellerle hazırlanan pidelerimiz"
    }
  ];

  // Use real data or fallback to placeholder
  const displayItems = galleryItems && galleryItems.length > 0 ? galleryItems : placeholderItems;
  
  // Filter items by category
    const filteredItems = selectedCategory === "Hepsi" 
    ? displayItems 
    : displayItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-zafer-surface text-zafer-text">
      {/* Modern Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-zafer-surface/80 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => setLocation("/")}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg">
                <img 
                  src={zaferLogo} 
                  alt="Zafer Lokantası Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-3xl font-playfair font-bold text-zafer-text">
                Zafer Lokantası
              </h1>
            </motion.div>
            
            <div className="flex space-x-4">
              <Button 
                onClick={() => setLocation("/")}
                className="glass-effect text-zafer-text border border-white/20 hover:bg-white/10"
              >
                Ana Sayfa
              </Button>
             
             
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zafer-surface via-zafer-surface-light to-zafer-dark"></div>
        
        {/* Animated background particles */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-zafer-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-8, 8, -8],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2.5 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              className="text-5xl md:text-7xl font-playfair font-bold text-zafer-text mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Lezzet
              <motion.span 
                className="text-zafer-primary block font-dancing text-6xl md:text-8xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Galerimiz
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-zafer-text-muted mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Mutfağımızdan sofralarımıza kadar her anı görsel bir şölen.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-zafer-surface-light/50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-8 py-3 rounded-full font-semibold transition-all duration-300
                  ${selectedCategory === category 
                    ? 'bg-gradient-to-r from-zafer-primary to-zafer-secondary text-white shadow-lg' 
                    : 'backdrop-blur-sm bg-white/10 text-zafer-text border border-white/20 hover:bg-white/20'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10 hover:border-zafer-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-zafer-primary/10">
                  {/* Image placeholder */}
                        <div className="relative h-64 bg-gradient-to-br from-zafer-primary/20 to-zafer-secondary/20 overflow-hidden">
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover z-0"
                            />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                    
                    {/* Category based icons */}
                    <div className="absolute inset-0 flex items-center justify-center text-white/30">
                      {item.category === "Yemekler" && (
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3"/>
                          <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" fill="white"/>
                        </svg>
                      )}
                      {item.category === "Restoran" && (
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                          <path d="M3 12h18v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3"/>
                          <path d="M3 6h18v6H3z" stroke="currentColor" strokeWidth="2" fill="white"/>
                        </svg>
                      )}
                      {item.category === "Mutfak" && (
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                          <path d="M8.5 2v8.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V2" stroke="currentColor" strokeWidth="2"/>
                          <path d="M8 12v10" stroke="currentColor" strokeWidth="2"/>
                          <path d="M16 12l1.5-1.5 1.5 1.5v10l-1.5-1.5L16 22v-10z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      )}
                      {item.category === "Etkinlikler" && (
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3"/>
                          <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                          <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                          <line x1="3" y1="10" x2="21" y2="10" stroke="white" strokeWidth="2"/>
                        </svg>
                      )}
                    </div>
                    
                    {/* Overlay content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <h3 className="text-xl font-playfair font-bold text-white mb-2 group-hover:text-zafer-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {item.description}
                      </p>
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-zafer-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-15"></div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredItems.length === 0 && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 className="text-2xl font-playfair text-zafer-text-muted mb-4">
                Bu kategoride henüz görsel bulunmuyor
              </h3>
              <p className="text-zafer-text-muted">
                Lütfen başka bir kategori seçin
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-zafer-dark to-zafer-surface-light">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-zafer-text mb-6">
              Lezzetlerimizi Keşfedin
            </h2>
            <p className="text-xl text-zafer-text-muted mb-8 max-w-2xl mx-auto">
              Bu güzel anları yaşamak için restoranımızı ziyaret edin.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => setLocation("/menu")}
                className="px-12 py-4 bg-gradient-to-r from-zafer-primary to-zafer-secondary text-white text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-zafer-primary/25 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Menümüzü İnceleyin
              </motion.button>
              
              <motion.button
                onClick={() => setLocation("/about")}
                className="px-12 py-4 backdrop-blur-sm bg-white/10 text-zafer-text text-lg font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Hikayemizi Öğrenin
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}