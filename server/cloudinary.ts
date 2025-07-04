import { v2 as cloudinary } from 'cloudinary';

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export class CloudinaryService {
  /**
   * Base64 string'i Cloudinary'ye upload eder
   */
  static async uploadFromBase64(
    base64String: string,
    folder: string = 'zafer-restaurant',
    transformation?: any
  ): Promise<CloudinaryUploadResult> {
    try {
      const result = await cloudinary.uploader.upload(base64String, {
        folder,
        transformation,
        resource_type: 'auto',
      });

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        resource_type: result.resource_type,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  }

  /**
   * URL'den görsel upload eder
   */
  static async uploadFromUrl(
    imageUrl: string,
    folder: string = 'zafer-restaurant',
    transformation?: any
  ): Promise<CloudinaryUploadResult> {
    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        folder,
        transformation,
        resource_type: 'auto',
      });

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        resource_type: result.resource_type,
      };
    } catch (error) {
      console.error('Cloudinary upload from URL error:', error);
      throw new Error('Failed to upload image from URL to Cloudinary');
    }
  }

  /**
   * Cloudinary'den görsel siler
   */
  static async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error('Failed to delete image from Cloudinary');
    }
  }

  /**
   * Görsel transformasyonu uygular
   */
  static getTransformedUrl(
    publicId: string,
    transformation: any = {}
  ): string {
    return cloudinary.url(publicId, {
      secure: true,
      ...transformation,
    });
  }

  /**
   * Menü görselleri için optimize edilmiş transformasyon
   */
  static getMenuImageUrl(publicId: string): string {
    return this.getTransformedUrl(publicId, {
      width: 400,
      height: 300,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    });
  }

  /**
   * Galeri görselleri için optimize edilmiş transformasyon
   */
  static getGalleryImageUrl(publicId: string): string {
    return this.getTransformedUrl(publicId, {
      width: 800,
      height: 600,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    });
  }

  /**
   * Avatar görselleri için optimize edilmiş transformasyon
   */
  static getAvatarImageUrl(publicId: string): string {
    return this.getTransformedUrl(publicId, {
      width: 100,
      height: 100,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto',
      format: 'auto',
    });
  }
}

export default CloudinaryService;