import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { saveAudioFile } from '@/lib/fileUpload';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const vocabularyItems = await prisma.vocabularyItem.findMany({
      include: {
        progress: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(vocabularyItems);
  } catch (error) {
    console.error('Failed to fetch vocabulary items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vocabulary items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const text = formData.get('text') as string;
    const translation = formData.get('translation') as string;
    const audioFile = formData.get('audio') as File;

    if (!text || !translation || !audioFile) {
      return NextResponse.json(
        { error: 'All fields including audio file are required' },
        { status: 400 }
      );
    }

    const audioUrl = await saveAudioFile(audioFile);

    const vocabularyItem = await prisma.vocabularyItem.create({
      data: {
        text,
        translation,
        audioUrl,
        progress: {
          create: {
            status: 'new',
            nextReviewDate: new Date(), // Initial review date is now
          },
        },
      },
      include: {
        progress: true,
      },
    });

    return NextResponse.json(vocabularyItem);
  } catch (error) {
    console.error('Failed to create vocabulary item:', error);
    return NextResponse.json(
      { error: 'Failed to create vocabulary item' },
      { status: 500 }
    );
  }
}