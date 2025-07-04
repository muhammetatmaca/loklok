import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import DonerSliceEffect from "@/components/doner-slice-effect";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import type { MenuItem, Testimonial, SignatureCollection } from "@shared/schema";
import zaferLogo from "@assets/ChatGPT Image 4 Tem 2025 03_51_43_1751590317642.png";

export default function Home() {
  const [, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: menuItems, isLoading: menuLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const { data: signatureCollection, isLoading: signatureLoading } = useQuery<SignatureCollection[]>({
    queryKey: ["/api/signature-collection"],
  });

  const featuredItems = menuItems?.filter(item => item.isPopular) || [];

  return (
    <div className="min-h-screen bg-zafer-surface text-zafer-text">
      {/* Modern Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-zafer-surface/80 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Zafer Lokantası Logo */}
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
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {['Ana Sayfa', 'Menü', 'Hakkımızda', 'Galeri', 'Yorumlar', 'İletişim'].map((item, index) => (
                <motion.a
                  key={item}
                  href={
                    item === 'Menü' ? '/menu' : 
                    item === 'Hakkımızda' ? '/about' :
                    item === 'Galeri' ? '/gallery' :
                    item === 'Yorumlar' ? '/testimonials' :
                    item === 'İletişim' ? '/contact' :
                    `#${item.toLowerCase().replace(' ', '-')}`
                  }
                  className="text-zafer-text-muted hover:text-zafer-primary transition-colors font-inter font-medium cursor-pointer"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={(e) => {
                    if (item === 'Menü') {
                      e.preventDefault();
                      setLocation('/menu');
                    } else if (item === 'Hakkımızda') {
                      e.preventDefault();
                      setLocation('/about');
                    } else if (item === 'Galeri') {
                      e.preventDefault();
                      setLocation('/gallery');
                    } else if (item === 'Yorumlar') {
                      e.preventDefault();
                      setLocation('/testimonials');
                    } else if (item === 'İletişim') {
                      e.preventDefault();
                      setLocation('/contact');
                    }
                  }}
                >
                  {item}
                </motion.a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <svg
                className="w-6 h-6 text-zafer-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
            
            
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 z-50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu Panel */}
          <motion.div
            className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-zafer-surface/95 backdrop-blur-xl border-l border-white/10 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-6">
              {/* Close Button */}
              <div className="flex justify-end mb-8">
                <motion.button
                  className="p-2 rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6 text-zafer-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Mobile Menu Items */}
              <div className="space-y-4">
                {['Ana Sayfa', 'Menü', 'Hakkımızda', 'Galeri', 'Yorumlar', 'İletişim'].map((item, index) => (
                  <motion.button
                    key={item}
                    className="w-full text-left p-4 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 hover:border-zafer-primary/30 transition-all duration-300 text-zafer-text font-inter font-medium"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (item === 'Menü') {
                        setLocation('/menu');
                      } else if (item === 'Hakkımızda') {
                        setLocation('/about');
                      } else if (item === 'Galeri') {
                        setLocation('/gallery');
                      } else if (item === 'Yorumlar') {
                        setLocation('/testimonials');
                      } else if (item === 'İletişim') {
                        setLocation('/contact');
                      } else if (item === 'Ana Sayfa') {
                        setLocation('/');
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{item}</span>
                      <svg className="w-5 h-5 text-zafer-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Mobile Footer */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg">
                    <img 
                      src={zaferLogo} 
                      alt="Zafer Lokantası Logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-playfair font-bold text-zafer-text">
                      Zafer Lokantası
                    </h3>
                    <p className="text-sm text-zafer-text-muted">
                      Geleneksel Türk Mutfağı
                    </p>
                  </div>
                </div>
                
                <div className="text-sm text-zafer-text-muted">
                  <p>📍 Atatürk Bulvarı No: 123/A</p>
                  <p>📞 +90 312 123 45 67</p>
                  <p>🕐 10:00 - 24:00</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-zafer-surface via-zafer-surface-light to-zafer-dark"></div>
        
        {/* Döner Slice Effect */}
        <DonerSliceEffect />
        
        {/* Animated background particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-zafer-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        <div className="container mx-auto px-6 py-20 relative z-30">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-6xl md:text-8xl font-playfair font-bold text-zafer-text mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Modern
              <motion.span 
                className="text-zafer-primary block font-dancing text-7xl md:text-9xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Türk Lezzeti
              </motion.span>
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl text-zafer-text-muted mb-12 font-inter leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Geleneksel döner ustası ile çağdaş gastronomi sanatının mükemmel uyumu. 
              Her lokmada İstanbul'un ruhunu hissedin.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {/* Modern Menu Button */}
              <motion.button
                onClick={() => setLocation("/menu")}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-zafer-primary to-zafer-secondary 
                          px-12 py-5 text-lg font-semibold text-white shadow-2xl
                          transition-all duration-300 hover:scale-105 hover:shadow-zafer-primary/25
                          backdrop-blur-sm border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 
                               transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:rotate-12">
                    <path d="M3 7c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v2H3V7z" fill="currentColor"/>
                    <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8z" fill="currentColor" opacity="0.7"/>
                    <circle cx="8" cy="15" r="1" fill="white"/>
                    <circle cx="16" cy="15" r="1" fill="white"/>
                  </svg>
                  <span>Menüyü Keşfet</span>
                </div>
              </motion.button>

              {/* Modern Reservation Button */}
              <motion.button
                onClick={() => setLocation("/reservations")}
                className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/10 
                          px-12 py-5 text-lg font-semibold text-zafer-text border border-white/20
                          transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-zafer-primary/50
                          shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-zafer-primary/10 to-zafer-secondary/10 
                               opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:scale-110">
                    <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M3 10h18" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="8" cy="16" r="1" fill="currentColor"/>
                    <circle cx="12" cy="16" r="1" fill="currentColor"/>
                    <circle cx="16" cy="16" r="1" fill="currentColor"/>
                  </svg>
                  <span>Rezervasyon Yap</span>
                </div>
              </motion.button>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zafer-text-muted"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M7 13l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 17l-3-3 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </section>

      {/* Product Showcase Section (No Prices) */}
      <section className="py-24 bg-gradient-to-br from-zafer-surface-light to-zafer-dark">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-playfair font-bold text-zafer-text mb-6">
              Signature <span className="text-zafer-primary">Collection</span>
            </h2>
            <p className="text-xl text-zafer-text-muted max-w-3xl mx-auto font-inter">
              Usta ellerde şekillenen özel tariflerimizle Türk mutfağının en seçkin lezzetlerini keşfedin
            </p>
          </motion.div>
          
          {menuLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="product-showcase p-8 animate-pulse">
                  <div className="w-full h-64 bg-zafer-surface-light rounded-2xl mb-6"></div>
                  <div className="h-8 bg-zafer-surface-light rounded mb-4"></div>
                  <div className="h-20 bg-zafer-surface-light rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="product-showcase group">
                    <CardContent className="p-8">
                      <div className="relative overflow-hidden rounded-2xl mb-6">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/30 transition-all duration-500"></div>
                        
                        <div className="absolute top-6 right-6 flex gap-2">
                          {item.isSpicy && (
                            <span className="bg-zafer-accent/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                              🌶️ Acılı
                            </span>
                          )}
                          {item.isVegetarian && (
                            <span className="bg-zafer-secondary/90 backdrop-blur-sm text-zafer-dark px-3 py-1 rounded-full text-sm font-medium">
                              🌱 Vejetaryen
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-playfair font-bold text-zafer-text mb-4 group-hover:text-zafer-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-zafer-text-muted font-inter leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Button 
              onClick={() => setLocation("/menu")}
              className="modern-button text-lg px-12 py-6"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-3">
                <path d="M2 3h6l2 13h10l2-7H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="19" r="1" stroke="currentColor" strokeWidth="2"/>
                <circle cx="20" cy="19" r="1" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Tüm Koleksiyonu Keşfet
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Signature Collection Section */}
      {signatureCollection && signatureCollection.length > 0 && (
        <section className="py-24 relative overflow-hidden bg-gradient-to-br from-zafer-surface to-zafer-surface-light">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-playfair font-bold text-zafer-text mb-6">
                <span className="text-zafer-primary">Signature</span> Collection
              </h2>
              <p className="text-xl text-zafer-text-muted max-w-2xl mx-auto font-inter leading-relaxed">
                Zafer Lokantası'nın gurur duyduğu özel koleksiyonu
              </p>
            </motion.div>

            {signatureLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-80 bg-zafer-surface-light rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {signatureCollection.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Card className="modern-card group">
                      <CardContent className="p-8">
                        <div className="relative overflow-hidden rounded-2xl mb-6">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/30 transition-all duration-500"></div>
                          
                          <div className="absolute top-6 right-6">
                            <span className="bg-zafer-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                              ⭐ Signature
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-playfair font-bold text-zafer-text mb-4 group-hover:text-zafer-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-zafer-text-muted font-inter leading-relaxed">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-zafer-surface/95 to-zafer-surface-light/95"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-playfair font-bold text-zafer-text mb-8">
                <span className="text-zafer-primary">Zafer</span> Hikayesi
              </h2>
              <p className="text-lg text-zafer-text-muted mb-6 font-inter leading-relaxed">
                1975 yılından bu yana İstanbul'un kalbinde, geleneksel Türk mutfağının 
                eşsiz lezzetlerini çağdaş gastronomi sanatıyla buluştururuz. Üç nesil 
                boyunca aktarılan usta bilgisi ve modern tekniklerin mükemmel uyumu.
              </p>
              <p className="text-lg text-zafer-text-muted mb-10 font-inter leading-relaxed">
                Her tabakta, geçmişin zenginliği ile geleceğin vizyonunu bir araya getiren 
                Zafer Lokantası, otantik döner kebabı ve benzersiz lezzetleriyle 
                unutulmaz deneyimler sunuyor.
              </p>
              <Button className="modern-button text-lg px-8 py-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mr-3">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Hikayemizi Keşfet
              </Button>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="modern-card p-10">
                <div className="grid grid-cols-2 gap-8 text-center">
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-zafer-primary">48+</div>
                    <div className="text-zafer-text-muted font-inter">Yıllık Deneyim</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-zafer-primary">2500+</div>
                    <div className="text-zafer-text-muted font-inter">Mutlu Müşteri</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-zafer-primary">35+</div>
                    <div className="text-zafer-text-muted font-inter">Özel Tarif</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-zafer-primary">100%</div>
                    <div className="text-zafer-text-muted font-inter">Doğal Malzeme</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-zafer-dark to-zafer-surface">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-playfair font-bold text-zafer-text mb-6">
              Müşteri <span className="text-zafer-primary">Deneyimleri</span>
            </h2>
            <p className="text-xl text-zafer-text-muted max-w-3xl mx-auto font-inter">
              Sizlerin memnuniyeti bizim en büyük başarımız
            </p>
          </motion.div>
          
          {testimonialsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="modern-card p-8 animate-pulse">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-zafer-surface-light rounded-full mr-4"></div>
                    <div>
                      <div className="h-5 bg-zafer-surface-light rounded mb-2 w-24"></div>
                      <div className="h-4 bg-zafer-surface-light rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-24 bg-zafer-surface-light rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials?.slice(0, 6).map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="modern-card">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-zafer-primary to-zafer-secondary rounded-full flex items-center justify-center mr-4">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-zafer-text text-lg">{testimonial.customerName}</h4>
                          <div className="flex text-zafer-primary">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-zafer-text-muted italic font-inter leading-relaxed text-lg">
                        "{testimonial.review}"
                      </p>
                      <div className="text-zafer-text-muted text-sm mt-6 border-t border-white/10 pt-4">
                        {testimonial.date}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-br from-zafer-surface-light to-zafer-dark">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-playfair font-bold text-zafer-text mb-6">
              <span className="text-zafer-primary">İletişim</span> & Rezervasyon
            </h2>
            <p className="text-xl text-zafer-text-muted max-w-3xl mx-auto font-inter">
              Size en yakın deneyimi sunmak için buradayız
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div 
              className="modern-card p-10"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-playfair font-bold text-zafer-text mb-8">
                Bize Ulaşın
              </h3>
              
              <div className="space-y-6">
                {[
                  {
                    icon: (
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                    ),
                    title: "Adres",
                    content: "Sultanahmet Mah. Lokanta Sok. No:48 Fatih/İstanbul"
                  },
                  {
                    icon: (
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="currentColor"/>
                    ),
                    title: "Telefon",
                    content: "+90 212 555 0148"
                  },
                  {
                    icon: (
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/>
                    ),
                    title: "Çalışma Saatleri",
                    content: "Her gün 11:00 - 24:00"
                  },
                  {
                    icon: (
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                    ),
                    title: "E-posta",
                    content: "hello@zaferlokantasi.com"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-zafer-primary to-zafer-secondary rounded-2xl flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                        {item.icon}
                      </svg>
                    </div>
                    <div>
                      <div className="text-zafer-text font-bold text-lg">{item.title}</div>
                      <div className="text-zafer-text-muted font-inter">{item.content}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 pt-8 border-t border-white/10">
                <Button className="modern-button w-full text-lg py-6">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-3">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Online Rezervasyon Yap
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="modern-card p-10"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-playfair font-bold text-zafer-text mb-8">
                Konumumuz
              </h3>
              <div className="w-full h-80 bg-gradient-to-br from-zafer-surface to-zafer-surface-light rounded-2xl flex items-center justify-center border border-white/10">
                <div className="text-center text-zafer-text-muted">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-4 text-zafer-primary">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <p className="font-inter">Google Maps Entegrasyonu</p>
                  <p className="text-sm mt-2">Sultanahmet, İstanbul</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      

      {/* Footer */}
      <footer className="bg-zafer-dark py-20 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-zafer-primary to-zafer-secondary rounded-2xl flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M8.5 2v8.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6.5 2v6.5c0 .83.67 1.5 1.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12.5 2v6.5c0 .83-.67 1.5-1.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 12v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M16 12l1.5-1.5 1.5 1.5v10l-1.5-1.5L16 22v-10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-3xl font-playfair font-bold text-zafer-text">Zafer Lokantası</h3>
              </div>
              <p className="text-zafer-text-muted font-inter leading-relaxed">
                Geleneksel Türk mutfağının modern yorumu. 1975'ten beri kalite ve lezzet garantisiyle.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-playfair font-bold text-zafer-text mb-6">Hızlı Menü</h4>
              <ul className="space-y-3 text-zafer-text-muted font-inter">
                {['Ana Sayfa', 'Menü', 'Hakkımızda', 'Yorumlar', 'İletişim'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-zafer-primary transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-playfair font-bold text-zafer-text mb-6">Sosyal Medya</h4>
              <div className="flex space-x-4">
                {['facebook', 'instagram', 'twitter', 'youtube'].map((platform) => (
                  <a 
                    key={platform}
                    href="#" 
                    className="w-12 h-12 bg-gradient-to-br from-zafer-primary to-zafer-secondary rounded-2xl flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
          
          <div className="border-t border-white/10 mt-16 pt-8 text-center text-zafer-text-muted font-inter">
            <p>&copy; 2024 Zafer Lokantası. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}