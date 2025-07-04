import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, Save, X } from "lucide-react";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import type { MenuItem, InsertMenuItem } from "@shared/schema";

export default function Admin() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<InsertMenuItem>({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    isSpicy: false,
    isVegetarian: false,
    isPopular: false,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertMenuItem) => {
      return await apiRequest("/api/admin/menu", "POST", data);
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
      return await apiRequest(`/api/admin/menu/${id}`, "PUT", data);
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
      return await apiRequest(`/api/admin/menu/${id}`, "DELETE");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  const categories = ["Kebabs", "Appetizers", "Mains", "Desserts", "Beverages"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zafer-surface via-zafer-surface/95 to-zafer-surface">
      {/* Header */}
      <div className="bg-zafer-surface/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zafer-primary">Admin Panel</h1>
              <p className="text-zafer-text-muted mt-2">Menü yönetimi</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-zafer-primary hover:bg-zafer-primary/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Öğe Ekle
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-zafer-surface border-zafer-primary/20">
                <DialogHeader>
                  <DialogTitle className="text-zafer-primary">
                    {editingItem ? "Menü Öğesini Düzenle" : "Yeni Menü Öğesi Ekle"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-zafer-text">İsim</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-zafer-surface/50 border-zafer-primary/20 text-zafer-text"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price" className="text-zafer-text">Fiyat</Label>
                      <Input
                        id="price"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="bg-zafer-surface/50 border-zafer-primary/20 text-zafer-text"
                        placeholder="₺15.99"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-zafer-text">Açıklama</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-zafer-surface/50 border-zafer-primary/20 text-zafer-text"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="text-zafer-text">Kategori</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger className="bg-zafer-surface/50 border-zafer-primary/20 text-zafer-text">
                          <SelectValue placeholder="Kategori seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="image" className="text-zafer-text">Resim URL</Label>
                      <Input
                        id="image"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="bg-zafer-surface/50 border-zafer-primary/20 text-zafer-text"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isSpicy"
                        checked={formData.isSpicy || false}
                        onCheckedChange={(checked) => setFormData({ ...formData, isSpicy: checked as boolean })}
                      />
                      <Label htmlFor="isSpicy" className="text-zafer-text">Acı</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isVegetarian"
                        checked={formData.isVegetarian || false}
                        onCheckedChange={(checked) => setFormData({ ...formData, isVegetarian: checked as boolean })}
                      />
                      <Label htmlFor="isVegetarian" className="text-zafer-text">Vejetaryen</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isPopular"
                        checked={formData.isPopular || false}
                        onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked as boolean })}
                      />
                      <Label htmlFor="isPopular" className="text-zafer-text">Popüler</Label>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      className="bg-zafer-primary hover:bg-zafer-primary/90 text-white"
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingItem ? "Güncelle" : "Ekle"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setEditingItem(null);
                        resetForm();
                      }}
                      className="border-zafer-primary/20 text-zafer-text"
                    >
                      <X className="w-4 h-4 mr-2" />
                      İptal
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
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
      </div>

      <MobileBottomNav />
    </div>
  );
}