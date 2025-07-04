import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("adminToken", data.token);
        toast({
          title: "Giriş Başarılı",
          description: "Admin paneline yönlendiriliyorsunuz...",
        });
        setTimeout(() => setLocation("/admin"), 1000);
      } else {
        toast({
          title: "Giriş Hatası",
          description: "Kullanıcı adı veya şifre hatalı.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Bağlantı Hatası",
        description: "Sunucuya bağlanırken hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zafer-dark via-zafer-surface to-zafer-surface-light flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="backdrop-blur-sm bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-4"
            >
              <div className="p-4 bg-zafer-primary/20 rounded-full">
                <Lock className="w-8 h-8 text-zafer-primary" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-playfair text-zafer-text">
              Admin Girişi
            </CardTitle>
            <CardDescription className="text-zafer-text-muted">
              Zafer Lokantası Yönetim Paneli
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-zafer-text">
                  Kullanıcı Adı
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Admin kullanıcı adı"
                  className="bg-white/10 border-white/20 text-zafer-text placeholder:text-zafer-text-muted"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zafer-text">
                  Şifre
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Admin şifresi"
                    className="bg-white/10 border-white/20 text-zafer-text placeholder:text-zafer-text-muted pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zafer-text-muted hover:text-zafer-text"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-zafer-primary hover:bg-zafer-primary/90 text-white font-semibold py-3 transition-all duration-300"
              >
                {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => setLocation("/")}
                className="text-zafer-text-muted hover:text-zafer-text"
              >
                Ana Sayfaya Dön
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}