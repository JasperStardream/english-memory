import { NextRequest } from 'next/server';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    const filename = params.filename;
    const filePath = path.join(process.cwd(), 'data', 'audio', filename);

    // Check if file exists
    try {
      await stat(filePath);
    } catch {
      return new Response('File not found', { status: 404 });
    }

    // Create read stream
    const stream = createReadStream(filePath);

    // Return the audio file with appropriate headers
    return new Response(stream as any, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `inline; filename="${filename}"`
      }
    });
  } catch (error) {
    console.error('Error serving audio file:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}