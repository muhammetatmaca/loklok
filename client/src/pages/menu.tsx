import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import type { MenuItem } from "@shared/schema";
import zaferLogo from "@assets/ChatGPT Image 4 Tem 2025 03_51_43_1751590317642.png";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import bosfoto from "@assets/download.png";
import { Helmet } from "react-helmet";

export default function Menu() {
  const [, setLocation] = useLocation();
    const [selectedCategory, setSelectedCategory] = useState<string>("Hepsi");

  const { data: menuItems, isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  // Get unique categories
  const uniqueCategories = menuItems ? 
    menuItems.reduce((cats: string[], item) => {
      if (!cats.includes(item.category)) {
        cats.push(item.category);
      }
      return cats;
    }, []) : [];
    const categories = ["Hepsi", ...uniqueCategories];
  
  // Filter items by category
    const filteredItems = selectedCategory === "Hepsi" 
    ? menuItems || []
    : menuItems?.filter(item => item.category === selectedCategory) || [];

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
    const menuStructuredData = {
        "@context": "https://schema.org",
        "@type": "Menu",
        name: "Zafer Lokantası Menü",
        hasMenuSection: [
            {
                "@type": "MenuSection",
                name: selectedCategory === "Hepsi" ? "Tüm Ürünler" : selectedCategory,
                hasMenuItem: filteredItems.map((item) => ({
                    "@type": "MenuItem",
                    name: item.name,
                    description: item.description || "",
                    image: item.image || "https://zaferlokantasi.com.tr/attached_assets/download.png",
                    offers: {
                        "@type": "Offer",
                        priceCurrency: "TRY",
                        price: item.price.replace(/[^\d.,]/g, ""), // sadece rakam ve nokta/virgül
                        availability: "https://schema.org/InStock",
                    },
                    suitableForDiet: item.isVegetarian ? "https://schema.org/VegetarianDiet" : undefined,
                    // Daha fazla özellik eklenebilir
                })),
            },
        ],
    };
  return (
      <div className="min-h-screen bg-zafer-surface text-zafer-text">
          <Helmet>
              <title>Menü | Zafer Lokantası</title>
              <meta
                  name="description"
                  content="Zafer Lokantası'nın özenle hazırladığı zengin menüsünü keşfedin. Et yemekleri, çorbalar, tatlılar ve daha fazlası sizi bekliyor."
              />
              <meta
                  name="keywords"
                  content="Zafer Lokantası menü,döner,karadeniz döner, Bayburt yemek menüsü, et yemekleri, çorba çeşitleri, tatlılar"
              />
              <meta property="og:title" content="Menü | Zafer Lokantası" />
              <meta
                  property="og:description"
                  content="Bayburt’un en sevilen lokantasının eşsiz yemek menüsünü inceleyin. Lezzet dolu bir deneyim sizi bekliyor."
              />
              <meta property="og:type" content="website" />
              <meta property="og:url" content="https://zaferlokantasi.com.tr/menu" />
              <meta property="og:image" content="https://zaferlokantasi.com.tr/seo/og-menu.jpg" />

              {/* JSON-LD yapılandırılmış veri */}
              <script type="application/ld+json">
                  {JSON.stringify(menuStructuredData)}
              </script>
          </Helmet>

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
            
            <Button 
              onClick={() => setLocation("/")}
              className="glass-effect text-zafer-text border border-white/20 hover:bg-white/10"
            >
              Ana Sayfa
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zafer-surface via-zafer-surface-light to-zafer-dark"></div>
        
        {/* Animated background particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-zafer-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-5, 5, -5],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
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
                Menümüz
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-zafer-text-muted mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
                          Menüde her damak tadına uygun seçenekler bulunur. Günlük taze malzemelerle hazırlanır.
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

      {/* Menu Items */}
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
                className="group"
              >
                <Card className="overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10 hover:border-zafer-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-zafer-primary/10 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-64 bg-gradient-to-br from-zafer-primary/20 to-zafer-secondary/20 overflow-hidden">
                    {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.currentTarget;
                                        if (target.src !== bosfoto) {
                                            target.onerror = null; // sonsuz döngü önlemek için
                                            target.src = bosfoto;
                                            console.log('Image load failed, fallback used:', item.image);
                                        }
                                    }}
                                />


                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/30">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3"/>
                          <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" fill="white"/>
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                      {item.isPopular && <Badge className="bg-zafer-primary text-white">Popüler</Badge>}
                      {item.isSpicy && <Badge className="bg-red-500 text-white">Acı</Badge>}
                      {item.isVegetarian && <Badge className="bg-green-500 text-white">Vejetaryen</Badge>}
                    </div>
                  </div>
                  
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-playfair font-bold text-zafer-text group-hover:text-zafer-primary transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-2xl font-bold text-zafer-primary">
                        ₺{item.price}
                      </span>
                    </div>
                    
                    <p className="text-zafer-text-muted leading-relaxed mb-4 flex-1">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-center mt-auto">
                      <Badge variant="outline" className="text-zafer-primary border-zafer-primary/30">
                        {item.category}
                      </Badge>
                    </div>
                  </CardContent>
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
                Bu kategoride henüz ürün bulunmuyor
              </h3>
              <p className="text-zafer-text-muted">
                Lütfen başka bir kategori seçin
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-zafer-dark to-zafer-surface-light">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-zafer-text mb-6">
              Zafer Lokantası'nın Lezzetli Dünyası
            </h2>
            <p className="text-xl text-zafer-text-muted mb-8 max-w-2xl mx-auto">
              Türk mutfağının geleneksel lezzetlerini modern sunumlarla birleştiren eşsiz tatlar.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}