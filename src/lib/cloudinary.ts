import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export const ALLOWED_FILE_TYPES = {
  images: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function getResourceType(mimeType: string): "image" | "video" | "raw" | "auto" {
  if (ALLOWED_FILE_TYPES.images.includes(mimeType)) {
    return 'image';
  }
  if (mimeType.startsWith('video/')) {
    return 'video';
  }
  return 'raw';
}

export function isAllowedFileType(mimeType: string): boolean {
  return [
    ...ALLOWED_FILE_TYPES.images,
    ...ALLOWED_FILE_TYPES.documents,
  ].includes(mimeType);
}
