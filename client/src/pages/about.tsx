import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useState } from "react";
import zaferLogo from "@assets/ChatGPT Image 4 Tem 2025 03_51_43_1751590317642.png";
import MobileBottomNav from "@/components/mobile-bottom-nav";

export default function About() {
  const [, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-zafer-primary/30 rounded-full"
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
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              className="text-5xl md:text-7xl font-playfair font-bold text-zafer-text mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Bizim
              <motion.span 
                className="text-zafer-primary block font-dancing text-6xl md:text-8xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Hikayemiz
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-zafer-text-muted mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Geleneksel Türk lezzetlerini modern dünyayla buluşturan tutkulu bir yolculuk.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-zafer-surface-light/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-zafer-text mb-8">
                Lezzet Geleneği
              </h2>
              
              <div className="space-y-6 text-lg text-zafer-text-muted leading-relaxed">
                <p>
                     Zafer Lokantası, 1969 yılında Mustafa Aydoğdu tarafından Bayburt’ta kuruldu.
                     Üç kuşaktır aile işletmesi olarak devam eden mekan, geleneksel Türk mutfağının en lezzetli ve özgün tatlarını misafirleriyle buluşturuyor.
                     Sıcacık atmosferi ve kaliteli hizmet anlayışıyla Bayburt’un en sevilen lokantalarından biri olmayı sürdürüyor.
                </p>
                
                <p>
                     Menümüzde, özellikle meşhur et dönerimiz ve mantılı döner gibi yöresel lezzetler ön plandadır.
                     Ayrıca taptaze malzemelerle hazırlanan çorbalar ve sulu yemeklerimiz de büyük beğeni topluyor.
                     Her tabakta ustalarımızın sevgi ve emeğini hissedeceğiniz bir deneyim sunmayı amaçlıyoruz.
                </p>
                
                <p>
                     Zafer Lokantası olarak sadece lezzet değil, aynı zamanda toplumumuzun bir parçası olmaktan gurur duyuyoruz.
                     Ramazan aylarında ihtiyaç sahiplerine iftar yemekleri vermek gibi sosyal sorumluluk projelerine aktif destek veriyor, misafirlerimizin gönül rahatlığıyla keyifli vakit geçirmesini sağlıyoruz.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="w-full h-96 bg-gradient-to-br from-zafer-primary/20 to-zafer-secondary/20 rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white/50">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3"/>
                    <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" fill="white"/>
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-zafer-text mb-6">
              Değerlerimiz
            </h2>
            <p className="text-xl text-zafer-text-muted max-w-3xl mx-auto">
              Her adımımızda bizi yönlendiren temel ilkeler
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                    title: "Kalite ve Doğallık",
                    description: "Yemeklerimizde sadece en taze ve doğal malzemeleri kullanarak, gerçek lezzeti ve sağlığı misafirlerimize sunmayı taahhüt ediyoruz.",
                icon: "🥇"
              },
              {
                  title: "Misafirperverlik ve Samimiyet",
                  description: "Her misafirimiz bizim için özeldir; sıcak ve samimi bir ortamda, kendinizi evinizde hissetmenizi sağlamak en önemli önceliğimizdir.",
                icon: "🏛️"
              },
              {
                  title: "Geleneksel Değerler ve Sürdürülebilirlik",
                  description: "Bayburt’un ve Türk mutfağının geleneksel tatlarını yaşatırken, çevreye duyarlı ve sürdürülebilir bir işletme olarak topluma katkı sağlamayı hedefliyoruz.",
                icon: "💡"
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="backdrop-blur-sm bg-white/5 border border-white/10 hover:border-zafer-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-zafer-primary/10 h-full">
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-6">{value.icon}</div>
                    <h3 className="text-2xl font-playfair font-bold text-zafer-text mb-4">
                      {value.title}
                    </h3>
                    <p className="text-zafer-text-muted leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
    

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
              Lezzet Yolculuğuna Katılın
            </h2>
            <p className="text-xl text-zafer-text-muted mb-8 max-w-2xl mx-auto">
              Geleneksel Türk mutfağının en seçkin lezzetlerini deneyimlemek için bugün ziyaret edin.
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
                onClick={() => setLocation("/")}
                className="px-12 py-4 backdrop-blur-sm bg-white/10 text-zafer-text text-lg font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ana Sayfaya Dönün
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