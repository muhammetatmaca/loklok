import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import zaferLogo from "@assets/ChatGPT Image 4 Tem 2025 03_51_43_1751590317642.png";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { Helmet } from "react-helmet";

export default function Contact() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { name, email, phone, subject, message } = formData;

        const emailSubject = encodeURIComponent(subject || "Yeni Mesaj");
        const emailBody = encodeURIComponent(
            `Ad Soyad: ${name}\nE-posta: ${email}\nTelefon: ${phone || "-"}\n\nMesaj:\n${message}`
        );

        window.location.href = `mailto:muhammetatmaca79@gmail.com?subject=${emailSubject}&body=${emailBody}`;
    };
  return (
      <div className="min-h-screen bg-zafer-surface text-zafer-text">
          <Helmet>
              <title>İletişim | Zafer Lokantası</title>
              <meta
                  name="description"
                  content="Zafer Lokantası ile iletişime geçin. Telefon, adres, yol tarifi ve iletişim formu gibi tüm bilgilere ulaşın."
              />
              <meta
                  name="keywords"
                  content="Zafer Lokantası iletişim, Bayburt lokanta adres, restoran telefon, yol tarifi, Unutulmaz Caddesi"
              />
              <meta property="og:title" content="İletişim | Zafer Lokantası" />
              <meta
                  property="og:description"
                  content="Bize ulaşın: Kadızade, Unutulmaz Cd. No:2, 69000 Bayburt Merkez/Bayburt. Telefon, e-posta ve harita bilgileri burada."
              />
              <meta property="og:type" content="website" />
              <meta property="og:url" content="https://zaferlokantasi.com.tr/iletisim" />
              <meta property="og:image" content="https://zaferlokantasi.com.tr/seo/og-iletisim.jpg" />
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
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-zafer-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-6, 6, -6],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2.8 + Math.random() * 2,
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
              Bizimle
              <motion.span 
                className="text-zafer-primary block font-dancing text-6xl md:text-8xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                İletişime Geçin
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-zafer-text-muted mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Sorularınız, önerileriniz ve rezervasyonlarınız için buradan ulaşabilirsiniz.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="backdrop-blur-sm bg-white/5 border border-white/10 hover:border-zafer-primary/30 transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-playfair font-bold text-zafer-text mb-6">
                    Mesaj Gönderin
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-zafer-text mb-2 font-semibold">
                          Ad Soyad *
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="bg-white/10 border-white/20 text-zafer-text placeholder:text-zafer-text-muted focus:border-zafer-primary"
                          placeholder="Adınız ve soyadınız"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-zafer-text mb-2 font-semibold">
                          E-posta *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="bg-white/10 border-white/20 text-zafer-text placeholder:text-zafer-text-muted focus:border-zafer-primary"
                          placeholder="E-posta adresiniz"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-zafer-text mb-2 font-semibold">
                          Telefon
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="bg-white/10 border-white/20 text-zafer-text placeholder:text-zafer-text-muted focus:border-zafer-primary"
                          placeholder="Telefon numaranız"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-zafer-text mb-2 font-semibold">
                          Konu *
                        </label>
                        <Input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="bg-white/10 border-white/20 text-zafer-text placeholder:text-zafer-text-muted focus:border-zafer-primary"
                          placeholder="Mesaj konusu"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-zafer-text mb-2 font-semibold">
                        Mesajınız *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="bg-white/10 border-white/20 text-zafer-text placeholder:text-zafer-text-muted focus:border-zafer-primary resize-none"
                        placeholder="Mesajınızı buraya yazın..."
                      />
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-8 py-4 bg-gradient-to-r from-zafer-primary to-zafer-secondary text-white text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-zafer-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    >
                      {isSubmitting ? "Gönderiliyor..." : "Mesaj Gönder"}
                    </motion.button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-playfair font-bold text-zafer-text mb-8">
                  İletişim Bilgileri
                </h2>
                
                <div className="space-y-6">
                  {[
                    {
                      title: "Adres",
                          content: "Zafer Lokantası, Kadızade, Unutulmaz Cd. No:2, 69000 Bayburt Merkez/Bayburt",
                      icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      )
                    },
                    {
                      title: "Telefon",
                        content: "(0458) 211 73 35",
                      icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      )
                    },
                    {
                      title: "E-posta",
                      content: "info@zaferlokantasi.com",
                      icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                          <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      )
                    },
                    {
                      title: "Çalışma Saatleri",
                      content: "Pazartesi - Pazar\n05:00 - 20:30",
                      icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      )
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                      <Card className="backdrop-blur-sm bg-white/5 border border-white/10 hover:border-zafer-primary/30 transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="text-zafer-primary mt-1">
                              {item.icon}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-zafer-text mb-2">
                                {item.title}
                              </h3>
                              <p className="text-zafer-text-muted whitespace-pre-line">
                                {item.content}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Map Placeholder */}
                          <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.8 }}
                          >
                              <Card className="backdrop-blur-sm bg-white/5 border border-white/10 hover:border-zafer-primary/30 transition-all duration-300">
                                  <CardContent className="p-0 rounded-lg overflow-hidden">
                                      <a
                                          href="https://www.google.com/maps/place/Zafer+Lokantası,+Kadızade,+Unutulmaz+Cd.+No:2,+69000+Bayburt+Merkez/Bayburt"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="block w-full h-64 relative"
                                      >
                                          <iframe
                                              title="Zafer Lokantası Konumu"
                                              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.392944529187!2d40.2211532!3d40.2582111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406eaaf5a3539d9f%3A0x805a61d403b195ae!2sZafer+Lokantası!5e0!3m2!1str!2str!4v1720420000000"
                                              width="100%"
                                              height="100%"
                                              style={{ border: 0 }}
                                              allowFullScreen=""
                                              loading="lazy"
                                              referrerPolicy="no-referrer-when-downgrade"
                                              className="rounded-lg"
                                          ></iframe>

                                          {/* Kartın üzerine gelen gradient ve yazıyı kaldırdım, çünkü fotoğrafın üstüne yazı istenmiyordu */}
                                      </a>
                                  </CardContent>
                              </Card>
                          </motion.div>

            </motion.div>
          </div>
        </div>
      </section>

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
              Size Nasıl Yardımcı Olabiliriz?
            </h2>
            <p className="text-xl text-zafer-text-muted mb-8 max-w-2xl mx-auto">
              Herhangi bir sorunuz varsa, bize ulaşmaktan çekinmeyin. Ekibimiz size yardımcı olmaktan mutluluk duyar.
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
                onClick={() => setLocation("/testimonials")}
                className="px-12 py-4 backdrop-blur-sm bg-white/10 text-zafer-text text-lg font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Müşteri Yorumları
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