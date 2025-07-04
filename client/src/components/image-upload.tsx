import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string, publicId?: string) => void;
  type?: 'menu' | 'gallery' | 'avatar';
  label?: string;
  className?: string;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  type = 'menu', 
  label = "Görsel", 
  className = "" 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value || "");

  // Sync preview with value prop changes
  useEffect(() => {
    setPreview(value || "");
  }, [value]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      alert('Lütfen sadece resim dosyası seçin.');
      return;
    }

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Dosya boyutu 5MB\'dan küçük olmalıdır.');
      return;
    }

    setIsUploading(true);

    try {
      // Dosyayı base64'e çevir
      const base64 = await fileToBase64(file);
      
      // Cloudinary'ye upload et
      const result = await apiRequest('POST', '/api/upload/image', {
        base64,
        type,
        folder: `zafer-restaurant/${type}`
      }) as any;

      const imageUrl = result.optimized_url || result.secure_url;
      console.log('ImageUpload: Setting image URL:', imageUrl);
      setPreview(imageUrl);
      onChange(imageUrl, result.public_id);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Görsel yüklenirken hata oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlUpload = async (url: string) => {
    if (!url) return;

    setIsUploading(true);

    try {
      const result = await apiRequest('POST', '/api/upload/url', {
        url,
        type,
        folder: `zafer-restaurant/${type}`
      }) as any;

      setPreview(result.optimized_url || result.secure_url);
      onChange(result.optimized_url || result.secure_url, result.public_id);
    } catch (error) {
      console.error('URL upload error:', error);
      alert('URL\'den görsel yüklenirken hata oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-white">{label}</Label>
      
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-700"
          />
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={handleRemove}
            className="absolute top-2 right-2"
            disabled={isUploading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
          <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Görsel yükleyin veya URL girin</p>
          
          <div className="space-y-4">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="border-gray-700 text-gray-300"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Yükleniyor...' : 'Dosya Seç'}
              </Button>
            </div>
            
            <div className="text-gray-500">veya</div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Görsel URL'si girin"
                className="bg-gray-800 border-gray-700 text-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleUrlUpload(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
                disabled={isUploading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  handleUrlUpload(input.value);
                  input.value = '';
                }}
                disabled={isUploading}
                className="border-gray-700 text-gray-300"
              >
                Ekle
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}