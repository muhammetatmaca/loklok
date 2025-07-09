import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, Save, X, Image, FileText, Star, LogOut } from "lucide-react";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import ImageUpload from "@/components/image-upload";
import type { MenuItem, InsertMenuItem, GalleryImage, InsertGalleryImage, AboutInfo, InsertAboutInfo, Testimonial, InsertTestimonial, SignatureCollection, InsertSignatureCollection } from "@shared/schema";
import bosfoto from "@assets/download.png";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<InsertMenuItem>({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "", // ✅ varsayılan boş görsel buraya
    isSpicy: false,
    isVegetarian: false,
    isPopular: false,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast({
        title: "Giriş Gerekli",
        description: "Admin paneline erişmek için giriş yapmanız gerekiyor.",
        variant: "destructive",
      });
      setLocation("/admin/login");
    }
  }, [setLocation, toast]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast({
      title: "Çıkış Yapıldı",
      description: "Başarıyla çıkış yaptınız.",
    });
    setLocation("/admin/login");
  };

  // Gallery states
  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryImage | null>(null);
  const [galleryFormData, setGalleryFormData] = useState<InsertGalleryImage>({
    title: "",
    description: "",
    imageUrl: "",
    category: "",
    isActive: true,
  });

  // About states
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
  const [editingAboutItem, setEditingAboutItem] = useState<AboutInfo | null>(null);
  const [aboutFormData, setAboutFormData] = useState<InsertAboutInfo>({
    title: "",
    content: "",
    imageUrl: "",
    section: "",
    displayOrder: 0,
    isActive: true,
  });

  // Testimonial states
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
  const [editingTestimonialItem, setEditingTestimonialItem] = useState<Testimonial | null>(null);
  const [testimonialFormData, setTestimonialFormData] = useState<InsertTestimonial>({
    customerName: "",
    rating: 5,
    review: "",
    date: new Date().toISOString().split('T')[0],
    avatar: "",
  });

  // Signature Collection states
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [editingSignatureItem, setEditingSignatureItem] = useState<SignatureCollection | null>(null);
  const [signatureFormData, setSignatureFormData] = useState<InsertSignatureCollection>({
    title: "",
    description: "",
    image: "",
    displayOrder: 0,
    isActive: true,
  });

  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  const { data: galleryImages = [], isLoading: isGalleryLoading } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });

  const { data: aboutInfos = [], isLoading: isAboutLoading } = useQuery<AboutInfo[]>({
    queryKey: ["/api/about"],
  });

  const { data: testimonials = [], isLoading: isTestimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const { data: signatureCollection = [], isLoading: isSignatureLoading } = useQuery<SignatureCollection[]>({
    queryKey: ["/api/signature-collection"],
  });


    const createMutation = useMutation({
        mutationFn: async (data: InsertMenuItem) => {
            // image alanı boşsa varsayılanı koy
            const dataWithImage = {
                ...data,
                image: data.image?.trim() ? data.image : bosfoto,
            };

            return await apiRequest("POST", "/api/admin/menu", dataWithImage);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/menu"] });
            setIsAddDialogOpen(false);
            resetForm();
            toast({
                title: "Başarılı",
                description: "Menü öğesi eklendi",
            });
        },
        onError: () => {
            toast({
                title: "Hata",
                description: "Menü öğesi eklenirken hata oluştu",
                variant: "destructive",
            });
        },
    });


  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertMenuItem> }) => {
      return await apiRequest("PUT", `/api/admin/menu/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu"] });
      setEditingItem(null);
      resetForm();
      toast({
        title: "Başarılı",
        description: "Menü öğesi güncellendi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Menü öğesi güncellenirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/menu/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu"] });
      toast({
        title: "Başarılı",
        description: "Menü öğesi silindi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Menü öğesi silinirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  // Gallery mutations
  const createGalleryMutation = useMutation({
    mutationFn: async (data: InsertGalleryImage) => {
      return await apiRequest("POST", "/api/admin/gallery", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      setIsGalleryDialogOpen(false);
      resetGalleryForm();
      toast({ title: "Başarılı", description: "Galeri görseli eklendi" });
    },
    onError: () => {
      toast({ title: "Hata", description: "Galeri görseli eklenirken hata oluştu", variant: "destructive" });
    },
  });

  const updateGalleryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertGalleryImage> }) => {
      return await apiRequest("PUT", `/api/admin/gallery/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      setEditingGalleryItem(null);
      resetGalleryForm();
      toast({ title: "Başarılı", description: "Galeri görseli güncellendi" });
    },
    onError: () => {
      toast({ title: "Hata", description: "Galeri görseli güncellenirken hata oluştu", variant: "destructive" });
    },
  });

  const deleteGalleryMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ title: "Başarılı", description: "Galeri görseli silindi" });
    },
    onError: () => {
      toast({ title: "Hata", description: "Galeri görseli silinirken hata oluştu", variant: "destructive" });
    },
  });

  // About mutations
  const createAboutMutation = useMutation({
    mutationFn: async (data: InsertAboutInfo) => {
      return await apiRequest("POST", "/api/admin/about", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/about"] });
      setIsAboutDialogOpen(false);
      resetAboutForm();
      toast({ title: "Başarılı", description: "Hakkımızda bilgisi eklendi" });
    },
    onError: () => {
      toast({ title: "Hata", description: "Hakkımızda bilgisi eklenirken hata oluştu", variant: "destructive" });
    },
  });

  const updateAboutMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertAboutInfo> }) => {
      return await apiRequest("PUT", `/api/admin/about/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/about"] });
      setEditingAboutItem(null);
      resetAboutForm();
      toast({ title: "Başarılı", description: "Hakkımızda bilgisi güncellendi" });
    },
    onError: () => {
      toast({ title: "Hata", description: "Hakkımızda bilgisi güncellenirken hata oluştu", variant: "destructive" });
    },
  });

  const deleteAboutMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/about/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/about"] });
      toast({ title: "Başarılı", description: "Hakkımızda bilgisi silindi" });
    },
    onError: () => {
      toast({ title: "Hata", description: "Hakkımızda bilgisi silinirken hata oluştu", variant: "destructive" });
    },
  });

  // Testimonial mutations
  const createTestimonialMutation = useMutation({
    mutationFn: async (data: InsertTestimonial) => {
      return await apiRequest("POST", "/api/admin/testimonials", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      setIsTestimonialDialogOpen(false);
      resetTestimonialForm();
      toast({ title: "Başarılı", description: "Yorum eklendi" });
    },
    onError: () => {
      toast({ title: "Hata", description: "Yorum eklenirken hata oluştu", variant: "destructive" });
    },
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertTestimonial> }) => {
      return await apiRequest("PUT", `/api/admin/testimonials/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      setEditingTestimonialItem(null);
      resetTestimonialForm();
      toast({ title: "Başarılı", description: "Yorum güncellendi" });
    },
    onError: () => {
      toast({ title: "Hata", description: "Yorum güncellenirken hata oluştu", variant: "destructive" });
    },
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/testimonials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Başarılı", description: "Yorum silindi" });
    },
    onError: () => {
      toast({ title: "Hata", description: "Yorum silinirken hata oluştu", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      isSpicy: false,
      isVegetarian: false,
      isPopular: false,
    });
  };

  const resetGalleryForm = () => {
    setGalleryFormData({
      title: "",
      description: "",
      imageUrl: "",
      category: "",
      isActive: true,
    });
  };

  const resetAboutForm = () => {
    setAboutFormData({
      title: "",
      content: "",
      imageUrl: "",
      section: "",
      displayOrder: 0,
      isActive: true,
    });
  };

  const resetTestimonialForm = () => {
    setTestimonialFormData({
      customerName: "",
      rating: 5,
      review: "",
      date: new Date().toISOString().split('T')[0],
      avatar: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data being submitted:', formData);
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price,
      category: item.category,
      image: item.image || "",
      isSpicy: item.isSpicy || false,
      isVegetarian: item.isVegetarian || false,
      isPopular: item.isPopular || false,
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Bu menü öğesini silmek istediğinizden emin misiniz?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleGalleryEdit = (item: GalleryImage) => {
    setEditingGalleryItem(item);
    setGalleryFormData({
      title: item.title,
      description: item.description || "",
      imageUrl: item.imageUrl,
      category: item.category || "",
      isActive: item.isActive || true,
    });
  };

  const handleGalleryDelete = (id: number) => {
    if (window.confirm("Bu galeri görselini silmek istediğinizden emin misiniz?")) {
      deleteGalleryMutation.mutate(id);
    }
  };

  const handleAboutEdit = (item: AboutInfo) => {
    setEditingAboutItem(item);
    setAboutFormData({
      title: item.title,
      content: item.content,
      imageUrl: item.imageUrl || "",
      section: item.section,
      displayOrder: item.displayOrder || 0,
      isActive: item.isActive || true,
    });
  };

  const handleAboutDelete = (id: number) => {
    if (window.confirm("Bu hakkımızda bilgisini silmek istediğinizden emin misiniz?")) {
      deleteAboutMutation.mutate(id);
    }
  };

  const handleTestimonialEdit = (item: Testimonial) => {
    setEditingTestimonialItem(item);
    setTestimonialFormData({
      customerName: item.customerName,
      rating: item.rating,
      review: item.review,
      date: item.date,
      avatar: item.avatar || "",
    });
  };

  const handleTestimonialDelete = (id: number) => {
    if (window.confirm("Bu yorumu silmek istediğinizden emin misiniz?")) {
      deleteTestimonialMutation.mutate(id);
    }
  };

  // Signature Collection mutations
  const createSignatureMutation = useMutation({
    mutationFn: async (data: InsertSignatureCollection) => {
      return await apiRequest("POST", "/api/signature-collection", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/signature-collection"] });
      setIsSignatureDialogOpen(false);
      resetSignatureForm();
      toast({
        title: "Başarılı",
        description: "Signature Collection öğesi eklendi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Signature Collection öğesi eklenirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const updateSignatureMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertSignatureCollection> }) => {
      return await apiRequest("PUT", `/api/signature-collection/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/signature-collection"] });
      setEditingSignatureItem(null);
      resetSignatureForm();
      toast({
        title: "Başarılı",
        description: "Signature Collection öğesi güncellendi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Signature Collection öğesi güncellenirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const deleteSignatureMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/signature-collection/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/signature-collection"] });
      toast({
        title: "Başarılı",
        description: "Signature Collection öğesi silindi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Signature Collection öğesi silinirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const resetSignatureForm = () => {
    setSignatureFormData({
      title: "",
      description: "",
      image: "",
      displayOrder: 0,
      isActive: true,
    });
    setEditingSignatureItem(null);
    setIsSignatureDialogOpen(false);
  };

  const handleSignatureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSignatureItem) {
      updateSignatureMutation.mutate({
        id: editingSignatureItem.id,
        data: signatureFormData,
      });
    } else {
      createSignatureMutation.mutate(signatureFormData);
    }
  };

  const handleSignatureEdit = (item: SignatureCollection) => {
    setEditingSignatureItem(item);
    setSignatureFormData({
      title: item.title,
      description: item.description,
      image: item.image,
      displayOrder: item.displayOrder || 0,
      isActive: item.isActive || true,
    });
  };

  const handleSignatureDelete = (id: number) => {
    if (window.confirm("Bu signature collection öğesini silmek istediğinizden emin misiniz?")) {
      deleteSignatureMutation.mutate(id);
    }
  };

    const categories = ["Yemekler", "Döner", "Çorbalar", "Tatlılar", "İçecekler", "Salatalar", "Pilavlı Döner", "Mantı Döner", "Izgara", "Kasap Reyonu", "Paket"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zafer-surface via-zafer-surface/95 to-zafer-surface">
      {/* Header */}
      <div className="bg-zafer-surface/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zafer-primary">Admin Panel</h1>
              <p className="text-zafer-text-muted mt-2">Restoran yönetim sistemi</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-zafer-primary hover:bg-zafer-primary/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-zafer-surface border-zafer-primary/20">
                <DialogHeader>
                  <DialogTitle className="text-zafer-primary">
                    {editingItem ? "Menü Öğesini Düzenle" : "Yeni Menü Öğesi Ekle"}
                  </DialogTitle>
                  <DialogDescription className="text-zafer-text-muted text-sm">
                    {editingItem ? "Mevcut menü öğesinin bilgilerini güncelleyin" : "Menüye yeni bir öğe eklemek için aşağıdaki formu doldurun"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 p-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-zafer-text font-medium">Menü Öğesi Adı *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-gray-800 border-zafer-primary/40 text-white h-12 text-lg focus:bg-gray-700 placeholder:text-gray-400"
                        placeholder="Örn: Adana Kebap"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-zafer-text font-medium">Fiyat *</Label>
                      <Input
                        id="price"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="bg-gray-800 border-zafer-primary/40 text-white h-12 text-lg focus:bg-gray-700 placeholder:text-gray-400"
                        placeholder="₺85"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-zafer-text font-medium">Açıklama</Label>
                                          <Textarea
                                              id="description"
                                              value={formData.description ?? ""} // null veya undefined ise boş string
                                              onChange={(e) =>
                                                  setFormData({ ...formData, description: e.target.value || "" }) // boşsa yine "" olarak ayarla
                                              }
                                              className="bg-gray-800 border-zafer-primary/40 text-white min-h-[120px] text-lg focus:bg-gray-700 placeholder:text-gray-400"
                                              placeholder="Yemeğin detaylı açıklamasını yazın..."
                                              rows={5}
                                          />

                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-zafer-text font-medium">Kategori *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger className="bg-gray-800 border-zafer-primary/40 text-white h-12 focus:bg-gray-700">
                          <SelectValue placeholder="Kategori seçin" className="placeholder:text-gray-400" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <ImageUpload
                        value={formData.image}
                        onChange={(url) => setFormData({ ...formData, image: url })}
                        type="menu"
                        label="Menü Görseli"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zafer-text font-medium">Özellikler</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               
                      <div className="flex items-center space-x-3 p-3 border border-zafer-primary/20 rounded-lg bg-zafer-surface/30">
                        <Checkbox
                          id="isPopular"
                          checked={formData.isPopular || false}
                          onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked as boolean })}
                          className="w-5 h-5"
                        />
                        <Label htmlFor="isPopular" className="text-zafer-text font-medium cursor-pointer">⭐ Popüler</Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-6 border-t border-zafer-primary/10">
                    <Button
                      type="submit"
                      className="bg-zafer-primary hover:bg-zafer-primary/90 text-white h-12 text-lg px-8"
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      <Save className="w-5 h-5 mr-2" />
                      {editingItem ? "Güncelle" : "Kaydet"}
                      {(createMutation.isPending || updateMutation.isPending) && " ..."}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setEditingItem(null);
                        resetForm();
                      }}
                      className="border-zafer-primary/20 h-12 text-lg px-8 text-[#2b3245]"
                    >
                      <X className="w-5 h-5 mr-2" />
                      İptal
                    </Button>
                  </div>
                </form>
              </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-zafer-surface/50 border border-zafer-primary/20">
            <TabsTrigger value="menu" className="data-[state=active]:bg-zafer-primary data-[state=active]:text-white">
              <Plus className="w-4 h-4 mr-2" />
              Menü
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-zafer-primary data-[state=active]:text-white">
              <Image className="w-4 h-4 mr-2" />
              Galeri
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-zafer-primary data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Hakkımda
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="data-[state=active]:bg-zafer-primary data-[state=active]:text-white">
              <Star className="w-4 h-4 mr-2" />
              Yorum
            </TabsTrigger>
            <TabsTrigger value="signature" className="data-[state=active]:bg-zafer-primary data-[state=active]:text-white">
              <Star className="w-4 h-4 mr-2" />
              imza
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-zafer-surface/50 border-zafer-primary/20">
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="h-4 bg-zafer-primary/20 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-zafer-primary/20 rounded w-1/2 mb-4"></div>
                        <div className="h-3 bg-zafer-primary/20 rounded w-full mb-2"></div>
                        <div className="h-3 bg-zafer-primary/20 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems?.map((item: MenuItem, index: number) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="bg-zafer-surface/50 border-zafer-primary/20 hover:bg-zafer-surface/70 transition-all duration-200 h-full">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-zafer-primary text-lg">{item.name}</CardTitle>
                            <p className="text-zafer-accent font-bold text-lg mt-1">{item.price}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                handleEdit(item);
                                setIsAddDialogOpen(true);
                              }}
                              className="border-zafer-primary/20 text-zafer-primary hover:bg-zafer-primary/10"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(item.id)}
                              className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-zafer-text-muted text-sm mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="border-zafer-primary/20 text-zafer-primary">
                            {item.category}
                          </Badge>
                          {item.isSpicy && (
                            <Badge variant="destructive" className="bg-red-500/20 text-red-500">
                              Acı
                            </Badge>
                          )}
                          {item.isVegetarian && (
                            <Badge variant="outline" className="border-green-500/20 text-green-500">
                              Vejetaryen
                            </Badge>
                          )}
                          {item.isPopular && (
                            <Badge variant="outline" className="border-zafer-accent/20 text-zafer-accent">
                              Popüler
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl text-zafer-primary">Galeri Yönetimi</h3>
              <Dialog open={isGalleryDialogOpen} onOpenChange={setIsGalleryDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-zafer-primary hover:bg-zafer-primary/90 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Galeri Ekle
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-zafer-surface border-zafer-primary/20">
                  <DialogHeader>
                    <DialogTitle className="text-zafer-primary">
                      {editingGalleryItem ? "Galeri Görselini Düzenle" : "Yeni Galeri Görseli Ekle"}
                    </DialogTitle>
                  </DialogHeader>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (editingGalleryItem) {
                        updateGalleryMutation.mutate({ id: editingGalleryItem.id, data: galleryFormData });
                      } else {
                        createGalleryMutation.mutate(galleryFormData);
                      }
                    }}
                    className="space-y-3 mt-4 p-1"
                  >
                    <div>
                      <Label htmlFor="gallery-title" className="text-white">Başlık</Label>
                      <Input
                        id="gallery-title"
                        value={galleryFormData.title}
                        onChange={(e) => setGalleryFormData({...galleryFormData, title: e.target.value})}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gallery-description" className="text-white">Açıklama</Label>
                      <Textarea
                        id="gallery-description"
                        value={galleryFormData.description || ''}
                        onChange={(e) => setGalleryFormData({...galleryFormData, description: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <ImageUpload
                        value={galleryFormData.imageUrl}
                        onChange={(url) => setGalleryFormData({...galleryFormData, imageUrl: url})}
                        type="gallery"
                        label="Galeri Görseli"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gallery-category" className="text-white">Kategori</Label>
                      <Input
                        id="gallery-category"
                        value={galleryFormData.category || ''}
                        onChange={(e) => setGalleryFormData({...galleryFormData, category: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="gallery-isActive"
                        checked={galleryFormData.isActive ?? false}
                        onCheckedChange={(checked) => setGalleryFormData({...galleryFormData, isActive: checked as boolean})}
                      />
                      <Label htmlFor="gallery-isActive" className="text-white">Aktif</Label>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsGalleryDialogOpen(false);
                          setEditingGalleryItem(null);
                          resetGalleryForm();
                        }}
                        className="border-gray-700 text-gray-300"
                      >
                        İptal
                      </Button>
                      <Button
                        type="submit"
                        className="bg-zafer-primary hover:bg-zafer-primary/90 text-white"
                        disabled={createGalleryMutation.isPending || updateGalleryMutation.isPending}
                      >
                        {editingGalleryItem ? "Güncelle" : "Ekle"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {isGalleryLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-zafer-surface/50 border-zafer-primary/20">
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="h-48 bg-zafer-primary/20 rounded mb-4"></div>
                        <div className="h-4 bg-zafer-primary/20 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-zafer-primary/20 rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((item: GalleryImage, index: number) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="bg-zafer-surface/50 border-zafer-primary/20 hover:bg-zafer-surface/70 transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="relative mb-4">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                handleGalleryEdit(item);
                                setIsGalleryDialogOpen(true);
                              }}
                              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGalleryDelete(item.id)}
                              className="bg-red-500/20 border-red-500/30 text-red-500 hover:bg-red-500/30"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <h4 className="text-zafer-primary font-semibold">{item.title}</h4>
                        {item.description && (
                          <p className="text-zafer-text-muted text-sm mt-1">{item.description}</p>
                        )}
                        <div className="flex justify-between items-center mt-3">
                          {item.category && (
                            <Badge variant="outline" className="border-zafer-primary/20 text-zafer-primary">
                              {item.category}
                            </Badge>
                          )}
                          <Badge variant={item.isActive ? "default" : "secondary"}>
                            {item.isActive ? "Aktif" : "Pasif"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl text-zafer-primary">Hakkımızda Yönetimi</h3>
              <Dialog open={isAboutDialogOpen} onOpenChange={setIsAboutDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-zafer-primary hover:bg-zafer-primary/90 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    İçerik Ekle
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-zafer-surface border-zafer-primary/20">
                  <DialogHeader>
                    <DialogTitle className="text-zafer-primary">
                      {editingAboutItem ? "Hakkımızda İçeriğini Düzenle" : "Yeni Hakkımızda İçeriği Ekle"}
                    </DialogTitle>
                  </DialogHeader>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (editingAboutItem) {
                        updateAboutMutation.mutate({ id: editingAboutItem.id, data: aboutFormData });
                      } else {
                        createAboutMutation.mutate(aboutFormData);
                      }
                    }}
                    className="space-y-3 mt-4 p-1"
                  >
                    <div>
                      <Label htmlFor="about-title" className="text-white">Başlık</Label>
                      <Input
                        id="about-title"
                        value={aboutFormData.title}
                        onChange={(e) => setAboutFormData({...aboutFormData, title: e.target.value})}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="about-section" className="text-white">Bölüm</Label>
                      <Select 
                        value={aboutFormData.section} 
                        onValueChange={(value) => setAboutFormData({...aboutFormData, section: value})}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Bölüm seçin" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="hikayemiz">Hikayemiz</SelectItem>
                          <SelectItem value="misyonumuz">Misyonumuz</SelectItem>
                          <SelectItem value="vizyonumuz">Vizyonumuz</SelectItem>
                          <SelectItem value="ekibimiz">Ekibimiz</SelectItem>
                          <SelectItem value="degelerimiz">Değerlerimiz</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="about-content" className="text-white">İçerik</Label>
                      <Textarea
                        id="about-content"
                        value={aboutFormData.content}
                        onChange={(e) => setAboutFormData({...aboutFormData, content: e.target.value})}
                        required
                        rows={6}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <ImageUpload
                        value={aboutFormData.imageUrl || ''}
                        onChange={(url) => setAboutFormData({...aboutFormData, imageUrl: url})}
                        type="gallery"
                        label="Hakkımızda Görseli (İsteğe bağlı)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="about-displayOrder" className="text-white">Görüntüleme Sırası</Label>
                      <Input
                        id="about-displayOrder"
                        type="number"
                        value={aboutFormData.displayOrder || 0}
                        onChange={(e) => setAboutFormData({...aboutFormData, displayOrder: parseInt(e.target.value) || 0})}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="about-isActive"
                        checked={aboutFormData.isActive ?? false}
                        onCheckedChange={(checked) => setAboutFormData({...aboutFormData, isActive: checked as boolean})}
                      />
                      <Label htmlFor="about-isActive" className="text-white">Aktif</Label>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsAboutDialogOpen(false);
                          setEditingAboutItem(null);
                          resetAboutForm();
                        }}
                        className="border-gray-700 text-gray-300"
                      >
                        İptal
                      </Button>
                      <Button
                        type="submit"
                        className="bg-zafer-primary hover:bg-zafer-primary/90 text-white"
                        disabled={createAboutMutation.isPending || updateAboutMutation.isPending}
                      >
                        {editingAboutItem ? "Güncelle" : "Ekle"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {isAboutLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="bg-zafer-surface/50 border-zafer-primary/20">
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="h-4 bg-zafer-primary/20 rounded w-3/4 mb-4"></div>
                        <div className="h-3 bg-zafer-primary/20 rounded w-full mb-2"></div>
                        <div className="h-3 bg-zafer-primary/20 rounded w-full mb-2"></div>
                        <div className="h-3 bg-zafer-primary/20 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aboutInfos.map((item: AboutInfo, index: number) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="bg-zafer-surface/50 border-zafer-primary/20 hover:bg-zafer-surface/70 transition-all duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-zafer-primary text-lg">{item.title}</CardTitle>
                            <Badge variant="outline" className="border-zafer-primary/20 text-zafer-primary mt-2">
                              {item.section}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                handleAboutEdit(item);
                                setIsAboutDialogOpen(true);
                              }}
                              className="border-zafer-primary/20 text-zafer-primary hover:bg-zafer-primary/10"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAboutDelete(item.id)}
                              className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-zafer-text-muted text-sm mb-3 line-clamp-3">
                          {item.content}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-zafer-text-muted">
                            Sıra: {item.displayOrder}
                          </span>
                          <Badge variant={item.isActive ? "default" : "secondary"}>
                            {item.isActive ? "Aktif" : "Pasif"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="testimonials" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl text-zafer-primary">Yorumlar Yönetimi</h3>
              <Dialog open={isTestimonialDialogOpen} onOpenChange={setIsTestimonialDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-zafer-primary hover:bg-zafer-primary/90 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Yorum Ekle
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-zafer-surface border-zafer-primary/20">
                  <DialogHeader>
                    <DialogTitle className="text-zafer-primary">
                      {editingTestimonialItem ? "Yorumu Düzenle" : "Yeni Yorum Ekle"}
                    </DialogTitle>
                  </DialogHeader>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (editingTestimonialItem) {
                        updateTestimonialMutation.mutate({ id: editingTestimonialItem.id, data: testimonialFormData });
                      } else {
                        createTestimonialMutation.mutate(testimonialFormData);
                      }
                    }}
                    className="space-y-3 mt-4 p-1"
                  >
                    <div>
                      <Label htmlFor="testimonial-customerName" className="text-white">Müşteri Adı</Label>
                      <Input
                        id="testimonial-customerName"
                        value={testimonialFormData.customerName}
                        onChange={(e) => setTestimonialFormData({...testimonialFormData, customerName: e.target.value})}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="testimonial-rating" className="text-white">Puan (1-5)</Label>
                      <Select 
                        value={testimonialFormData.rating.toString()} 
                        onValueChange={(value) => setTestimonialFormData({...testimonialFormData, rating: parseInt(value)})}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Puan seçin" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="1">1 ⭐</SelectItem>
                          <SelectItem value="2">2 ⭐⭐</SelectItem>
                          <SelectItem value="3">3 ⭐⭐⭐</SelectItem>
                          <SelectItem value="4">4 ⭐⭐⭐⭐</SelectItem>
                          <SelectItem value="5">5 ⭐⭐⭐⭐⭐</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="testimonial-review" className="text-white">Yorum</Label>
                      <Textarea
                        id="testimonial-review"
                        value={testimonialFormData.review}
                        onChange={(e) => setTestimonialFormData({...testimonialFormData, review: e.target.value})}
                        required
                        rows={4}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="testimonial-date" className="text-white">Tarih</Label>
                      <Input
                        id="testimonial-date"
                        type="date"
                        value={testimonialFormData.date}
                        onChange={(e) => setTestimonialFormData({...testimonialFormData, date: e.target.value})}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <ImageUpload
                        value={testimonialFormData.avatar || ''}
                        onChange={(url) => setTestimonialFormData({...testimonialFormData, avatar: url})}
                        type="avatar"
                        label="Müşteri Avatarı (İsteğe bağlı)"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsTestimonialDialogOpen(false);
                          setEditingTestimonialItem(null);
                          resetTestimonialForm();
                        }}
                        className="border-gray-700 text-gray-300"
                      >
                        İptal
                      </Button>
                      <Button
                        type="submit"
                        className="bg-zafer-primary hover:bg-zafer-primary/90 text-white"
                        disabled={createTestimonialMutation.isPending || updateTestimonialMutation.isPending}
                      >
                        {editingTestimonialItem ? "Güncelle" : "Ekle"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {isTestimonialsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-zafer-surface/50 border-zafer-primary/20">
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="h-4 bg-zafer-primary/20 rounded w-3/4 mb-4"></div>
                        <div className="h-3 bg-zafer-primary/20 rounded w-full mb-2"></div>
                        <div className="h-3 bg-zafer-primary/20 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((item: Testimonial, index: number) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="bg-zafer-surface/50 border-zafer-primary/20 hover:bg-zafer-surface/70 transition-all duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {item.avatar && (
                                <img
                                  src={item.avatar}
                                  alt={item.customerName}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              )}
                              <div>
                                <CardTitle className="text-zafer-primary text-lg">{item.customerName}</CardTitle>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < item.rating ? "text-yellow-500" : "text-gray-300"}>
                                      ⭐
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                handleTestimonialEdit(item);
                                setIsTestimonialDialogOpen(true);
                              }}
                              className="border-zafer-primary/20 text-zafer-primary hover:bg-zafer-primary/10"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTestimonialDelete(item.id)}
                              className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-zafer-text-muted text-sm mb-3 line-clamp-3">
                          "{item.review}"
                        </p>
                        <div className="text-xs text-zafer-text-muted">
                          {new Date(item.date).toLocaleDateString('tr-TR')}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="signature" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl text-zafer-primary">Signature Collection Yönetimi</h3>
              <Dialog open={isSignatureDialogOpen} onOpenChange={setIsSignatureDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-zafer-primary hover:bg-zafer-primary/90 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Signature Öğesi Ekle
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-zafer-surface border-zafer-primary/20">
                  <DialogHeader>
                    <DialogTitle className="text-zafer-primary">
                      {editingSignatureItem ? "Signature Öğesini Düzenle" : "Yeni Signature Öğesi Ekle"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSignatureSubmit} className="space-y-3 p-1">
                    <div>
                      <Label htmlFor="signature-title" className="text-white">Başlık</Label>
                      <Input
                        id="signature-title"
                        value={signatureFormData.title}
                        onChange={(e) => setSignatureFormData({...signatureFormData, title: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signature-description" className="text-white">Açıklama</Label>
                      <Textarea
                        id="signature-description"
                        value={signatureFormData.description}
                        onChange={(e) => setSignatureFormData({...signatureFormData, description: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                    <div>
                      <ImageUpload
                        value={signatureFormData.image}
                        onChange={(url) => setSignatureFormData({...signatureFormData, image: url})}
                        type="gallery"
                        label="Signature Görseli"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signature-displayOrder" className="text-white">Görüntüleme Sırası</Label>
                      <Input
                        id="signature-displayOrder"
                        type="number"
                        value={signatureFormData.displayOrder || 0}
                        onChange={(e) => setSignatureFormData({...signatureFormData, displayOrder: parseInt(e.target.value) || 0})}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="signature-isActive"
                        checked={signatureFormData.isActive ?? false}
                        onCheckedChange={(checked) => setSignatureFormData({...signatureFormData, isActive: checked as boolean})}
                      />
                      <Label htmlFor="signature-isActive" className="text-white">Aktif</Label>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetSignatureForm}
                        className="border-gray-600 text-white hover:bg-gray-700"
                      >
                        İptal
                      </Button>
                      <Button
                        type="submit"
                        className="bg-zafer-primary hover:bg-zafer-primary/90 text-white"
                        disabled={createSignatureMutation.isPending || updateSignatureMutation.isPending}
                      >
                        {editingSignatureItem ? "Güncelle" : "Ekle"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {isSignatureLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-zafer-surface/50 border-zafer-primary/20">
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="h-4 bg-zafer-primary/20 rounded w-3/4 mb-4"></div>
                        <div className="h-3 bg-zafer-primary/20 rounded w-full mb-2"></div>
                        <div className="h-3 bg-zafer-primary/20 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {signatureCollection.map((item: SignatureCollection, index: number) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="bg-zafer-surface/50 border-zafer-primary/20 hover:border-zafer-primary/40 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <CardTitle className="text-zafer-primary text-lg mb-1">
                              {item.title}
                            </CardTitle>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                handleSignatureEdit(item);
                                setIsSignatureDialogOpen(true);
                              }}
                              className="border-zafer-primary/20 text-zafer-primary hover:bg-zafer-primary/10"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSignatureDelete(item.id)}
                              className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Sıra: {item.displayOrder || 0}
                          </Badge>
                          <Badge variant={item.isActive ? "default" : "secondary"} className="text-xs">
                            {item.isActive ? "Aktif" : "Pasif"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {item.image && (
                          <div className="mb-3">
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-full h-32 object-cover rounded"
                            />
                          </div>
                        )}
                        <p className="text-zafer-text-muted text-sm line-clamp-3">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <MobileBottomNav />
    </div>
  );
}