import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import type { MenuItem, Testimonial } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();

  const { data: menuItems, isLoading: menuLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const featuredItems = menuItems?.filter(item => item.isPopular) || [];

  return (
    <div className="min-h-screen bg-zafer-night">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-zafer-copper rounded-full flex items-center justify-center">
                <i className="fas fa-fire text-white text-xl"></i>
              </div>
              <h1 className="text-3xl font-playfair font-bold text-zafer-cream">
                Zafer Lokantası
              </h1>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-zafer-cream hover:text-zafer-gold transition-colors font-inter">
                Ana Sayfa
              </a>
              <a href="#menu" className="text-zafer-cream hover:text-zafer-gold transition-colors font-inter">
                Menü
              </a>
              <a href="#about" className="text-zafer-cream hover:text-zafer-gold transition-colors font-inter">
                Hakkımızda
              </a>
              <a href="#gallery" className="text-zafer-cream hover:text-zafer-gold transition-colors font-inter">
                Galeri
              </a>
              <a href="#testimonials" className="text-zafer-cream hover:text-zafer-gold transition-colors font-inter">
                Yorumlar
              </a>
              <a href="#contact" className="text-zafer-cream hover:text-zafer-gold transition-colors font-inter">
                İletişim
              </a>
            </div>
            
            <Button className="zafer-button">
              <i className="fas fa-phone mr-2"></i>
              Rezervasyon
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Döner */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zafer-night via-zafer-smoke to-zafer-charcoal"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 smoke-effect rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 smoke-effect rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 smoke-effect rounded-full"></div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-6xl md:text-8xl font-playfair font-bold text-zafer-cream mb-6 leading-tight">
                Otantik
                <span className="text-zafer-gold block font-dancing">Türk Lezzeti</span>
              </h2>
              <p className="text-xl md:text-2xl text-zafer-cream/80 mb-8 font-inter leading-relaxed max-w-2xl">
                Geleneksel döner ustası ile modern sunum tekniklerinin buluştuğu eşsiz lezzet deneyimi. 
                Her lokmada Türkiye'nin zengin mutfak kültürünü yaşayın.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  onClick={() => setLocation("/menu")}
                  className="zafer-button text-lg px-8 py-4"
                >
                  <i className="fas fa-utensils mr-2"></i>
                  Menüyü Keşfet
                </Button>
                <Button 
                  onClick={() => setLocation("/reservations")}
                  className="glass-effect text-zafer-cream border border-zafer-gold text-lg px-8 py-4 hover:bg-zafer-gold/20"
                >
                  <i className="fas fa-calendar mr-2"></i>
                  Rezervasyon Yap
                </Button>
              </div>
            </div>
            
            {/* 3D Döner Visualization */}
            <div className="relative flex justify-center">
              <div className="relative w-96 h-96 float-animation">
                <div className="absolute inset-0 bg-gradient-radial from-zafer-flame/30 to-transparent rounded-full glow-orange"></div>
                <div className="absolute inset-8 rotate-doner">
                  <div className="w-full h-full bg-gradient-to-b from-zafer-copper via-zafer-flame to-zafer-ember rounded-full shadow-2xl relative overflow-hidden">
                    {/* Döner meat texture simulation */}
                    <div className="absolute inset-4 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 rounded-full opacity-80"></div>
                    <div className="absolute inset-6 bg-gradient-to-l from-yellow-600 via-orange-600 to-red-700 rounded-full opacity-60"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-zafer-gold rounded-full shadow-lg"></div>
                    
                    {/* Döner skewer */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-2 h-80 bg-gradient-to-b from-gray-300 to-gray-600 rounded-full shadow-md"></div>
                  </div>
                </div>
                
                {/* Smoke Effects */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-20 smoke-effect rounded-full"></div>
                  <div className="w-6 h-16 smoke-effect rounded-full ml-4 delay-1000"></div>
                  <div className="w-4 h-12 smoke-effect rounded-full ml-2 delay-2000"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-zafer-cream/60 animate-bounce">
          <i className="fas fa-chevron-down text-2xl"></i>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section id="menu" className="py-20 bg-gradient-to-br from-zafer-smoke to-zafer-charcoal">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-playfair font-bold text-zafer-cream mb-6">
              Öne Çıkan <span className="text-zafer-gold">Lezzetler</span>
            </h2>
            <p className="text-xl text-zafer-cream/80 max-w-3xl mx-auto font-inter">
              Usta ellerde hazırlanan özel tariflerimiz ile Türk mutfağının en seçkin lezzetlerini keşfedin
            </p>
          </div>
          
          {menuLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="menu-card p-6 animate-pulse">
                  <div className="w-full h-48 bg-zafer-smoke rounded-lg mb-4"></div>
                  <div className="h-6 bg-zafer-smoke rounded mb-2"></div>
                  <div className="h-4 bg-zafer-smoke rounded mb-4"></div>
                  <div className="h-8 bg-zafer-smoke rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.map((item) => (
                <Card key={item.id} className="menu-card">
                  <CardContent className="p-6">
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute top-4 right-4">
                        {item.isSpicy && (
                          <span className="bg-zafer-crimson text-white px-2 py-1 rounded-full text-xs">
                            <i className="fas fa-pepper-hot mr-1"></i>Acılı
                          </span>
                        )}
                        {item.isVegetarian && (
                          <span className="bg-zafer-gold text-zafer-charcoal px-2 py-1 rounded-full text-xs ml-2">
                            <i className="fas fa-leaf mr-1"></i>Vejetaryen
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-playfair font-bold text-zafer-cream mb-2">
                      {item.name}
                    </h3>
                    <p className="text-zafer-cream/70 mb-4 font-inter leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-zafer-gold">
                        ₺{item.price}
                      </span>
                      <Button className="zafer-button">
                        <i className="fas fa-plus mr-2"></i>Sipariş Ver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button 
              onClick={() => setLocation("/menu")}
              className="zafer-button text-lg px-8 py-4"
            >
              <i className="fas fa-book-open mr-2"></i>
              Tüm Menüyü Görüntüle
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 parallax-section relative">
        <div className="absolute inset-0 bg-gradient-to-r from-zafer-night/90 to-zafer-smoke/90"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-playfair font-bold text-zafer-cream mb-6">
                <span className="text-zafer-gold">Zafer Lokantası</span><br />Hikayemiz
              </h2>
              <p className="text-lg text-zafer-cream/80 mb-6 font-inter leading-relaxed">
                1975 yılından bu yana İstanbul'un kalbinde, geleneksel Türk mutfağının 
                eşsiz lezzetlerini modern sunum teknikleri ile buluştururuz. Üç nesil 
                boyunca sürdürdüğümüz usta bilgisi ile her tabakta aile geleneğimizi yaşatırız.
              </p>
              <p className="text-lg text-zafer-cream/80 mb-8 font-inter leading-relaxed">
                Özenle seçilmiş malzemeler, geleneksel pişirme teknikleri ve modern 
                mutfak sanatının bir araya geldiği Zafer Lokantası'nda, otantik döner 
                kebabımız ile tanışmaya davetlisiniz.
              </p>
              <Button className="zafer-button text-lg px-8 py-4">
                <i className="fas fa-history mr-2"></i>
                Daha Fazla Bilgi
              </Button>
            </div>
            
            <div className="relative">
              <div className="doner-card p-8">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-4xl font-bold text-zafer-gold mb-2">48+</div>
                    <div className="text-zafer-cream">Yıllık Deneyim</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-zafer-gold mb-2">1000+</div>
                    <div className="text-zafer-cream">Mutlu Müşteri</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-zafer-gold mb-2">25+</div>
                    <div className="text-zafer-cream">Özel Tarif</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-zafer-gold mb-2">100%</div>
                    <div className="text-zafer-cream">Doğal Malzeme</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-zafer-charcoal to-zafer-night">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-playfair font-bold text-zafer-cream mb-6">
              Müşteri <span className="text-zafer-gold">Yorumları</span>
            </h2>
            <p className="text-xl text-zafer-cream/80 max-w-3xl mx-auto font-inter">
              Sizleri mutlu etmek bizim en büyük ödülümüz
            </p>
          </div>
          
          {testimonialsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="testimonial-card p-6 animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-zafer-smoke rounded-full mr-4"></div>
                    <div>
                      <div className="h-4 bg-zafer-smoke rounded mb-2 w-24"></div>
                      <div className="h-3 bg-zafer-smoke rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-20 bg-zafer-smoke rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials?.slice(0, 6).map((testimonial) => (
                <Card key={testimonial.id} className="testimonial-card">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-zafer-copper rounded-full flex items-center justify-center mr-4">
                        <i className="fas fa-user text-white"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-zafer-cream">{testimonial.customerName}</h4>
                        <div className="flex text-zafer-gold">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <i key={i} className="fas fa-star text-sm"></i>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-zafer-cream/80 italic font-inter leading-relaxed">
                      "{testimonial.review}"
                    </p>
                    <div className="text-zafer-cream/60 text-sm mt-4">
                      {testimonial.date}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-zafer-smoke to-zafer-charcoal">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-playfair font-bold text-zafer-cream mb-6">
              <span className="text-zafer-gold">İletişim</span> & Konum
            </h2>
            <p className="text-xl text-zafer-cream/80 max-w-3xl mx-auto font-inter">
              Bizi ziyaret edin veya rezervasyon yapın
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="doner-card p-8">
              <h3 className="text-3xl font-playfair font-bold text-zafer-cream mb-6">
                İletişim Bilgileri
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-zafer-copper rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-map-marker-alt text-white"></i>
                  </div>
                  <div>
                    <div className="text-zafer-cream font-bold">Adres</div>
                    <div className="text-zafer-cream/80">Sultanahmet Mah. Döner Sok. No:123 Fatih/İstanbul</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-zafer-copper rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-phone text-white"></i>
                  </div>
                  <div>
                    <div className="text-zafer-cream font-bold">Telefon</div>
                    <div className="text-zafer-cream/80">+90 212 555 0123</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-zafer-copper rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-clock text-white"></i>
                  </div>
                  <div>
                    <div className="text-zafer-cream font-bold">Çalışma Saatleri</div>
                    <div className="text-zafer-cream/80">Her gün 10:00 - 24:00</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-zafer-copper rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-envelope text-white"></i>
                  </div>
                  <div>
                    <div className="text-zafer-cream font-bold">E-posta</div>
                    <div className="text-zafer-cream/80">info@zaferlokantasi.com</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-zafer-gold/30">
                <Button className="zafer-button w-full text-lg py-4">
                  <i className="fas fa-calendar-alt mr-2"></i>
                  Online Rezervasyon Yap
                </Button>
              </div>
            </div>
            
            <div className="doner-card p-8">
              <h3 className="text-3xl font-playfair font-bold text-zafer-cream mb-6">
                Harita
              </h3>
              <div className="w-full h-80 bg-zafer-smoke rounded-lg flex items-center justify-center">
                <div className="text-center text-zafer-cream/60">
                  <i className="fas fa-map text-4xl mb-4"></i>
                  <p>Google Maps Entegrasyonu</p>
                  <p className="text-sm">Konum: Sultanahmet, İstanbul</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button className="floating-action-btn" onClick={() => setLocation("/reservations")}>
          <i className="fas fa-utensils text-xl"></i>
        </Button>
      </div>

      {/* Footer */}
      <footer className="bg-zafer-night py-16 border-t border-zafer-gold/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-zafer-copper rounded-full flex items-center justify-center">
                  <i className="fas fa-fire text-white text-xl"></i>
                </div>
                <h3 className="text-3xl font-playfair font-bold text-zafer-cream">Zafer Lokantası</h3>
              </div>
              <p className="text-zafer-cream/70 font-inter leading-relaxed">
                Geleneksel Türk mutfağının modern yorumu. 1975'ten beri kalite ve lezzet garantisiyle hizmetinizdeyiz.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-playfair font-bold text-zafer-cream mb-4">Hızlı Menü</h4>
              <ul className="space-y-2 text-zafer-cream/70">
                <li><a href="#home" className="hover:text-zafer-gold transition-colors">Ana Sayfa</a></li>
                <li><a href="#menu" className="hover:text-zafer-gold transition-colors">Menü</a></li>
                <li><a href="#about" className="hover:text-zafer-gold transition-colors">Hakkımızda</a></li>
                <li><a href="#testimonials" className="hover:text-zafer-gold transition-colors">Yorumlar</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-playfair font-bold text-zafer-cream mb-4">Sosyal Medya</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-zafer-copper rounded-full flex items-center justify-center hover:bg-zafer-flame transition-colors">
                  <i className="fab fa-facebook-f text-white"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-zafer-copper rounded-full flex items-center justify-center hover:bg-zafer-flame transition-colors">
                  <i className="fab fa-instagram text-white"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-zafer-copper rounded-full flex items-center justify-center hover:bg-zafer-flame transition-colors">
                  <i className="fab fa-twitter text-white"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-zafer-gold/30 mt-12 pt-8 text-center text-zafer-cream/60">
            <p>&copy; 2024 Zafer Lokantası. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}