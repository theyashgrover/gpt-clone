import { NextRequest, NextResponse } from 'next/server';
import { cloudinary, isAllowedFileType, MAX_FILE_SIZE, getResourceType } from '@/lib/cloudinary';
import type { FileAttachment } from '@/types/chat';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!isAllowedFileType(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const resourceType = getResourceType(file.type);
    
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder: 'chatgpt-clone',
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const result = uploadResponse as any;

    // Create file attachment object
    const attachment: FileAttachment = {
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: result.secure_url,
      publicId: result.public_id,
      resourceType,
    };

    return NextResponse.json({ attachment });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
