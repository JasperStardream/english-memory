import { writeFile } from 'fs/promises';
import path from 'path';

export async function saveAudioFile(file: File): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), 'data', 'audio');
    const filePath = path.join(uploadDir, filename);

    // Ensure the upload directory exists
    await createUploadDirIfNotExists(uploadDir);

    // Write the file
    await writeFile(filePath, buffer);

    // Return the public URL
    return `api/audio/${filename}`;
  } catch (error) {
    console.error('Error saving audio file:', error);
    throw new Error('Failed to save audio file');
  }
}

async function createUploadDirIfNotExists(dir: string) {
  const fs = require('fs').promises;
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}