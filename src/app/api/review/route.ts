import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get the current date
    const now = new Date();

    // Find vocabulary items that are due for review
    const dueItems = await prisma.vocabularyItem.findMany({
      select: {
        id: true,
        text: true,
        translation: true,
        audioUrl: true,
        progress: {
          orderBy: {
            nextReviewDate: 'desc'
          },
          take: 1
        }
      }
    });

    dueItems.sort((a, b) => {
      const aDate = a.progress[0]?.nextReviewDate || new Date(0);
      const bDate = b.progress[0]?.nextReviewDate || new Date(0);
      return aDate.getTime() - bDate.getTime();
    });

    // Always return an array of items, even if empty
    return NextResponse.json({ items: dueItems || [] });
  } catch (error) {
    console.error('Failed to fetch review items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review items', items: [] },
      { status: 500 }
    );
  }
}