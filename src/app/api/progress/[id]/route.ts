import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to calculate next review date based on status and previous interval
async function calculateNextReviewDate(status: string, vocabularyId: string): Promise<Date> {
  const now = new Date();

  // For forgotten or new items, review in 1 day
  if (status === 'forgotten' || status === 'new') {
    return new Date(now.setDate(now.getDate() + 1));
  }

  // For familiar items, review in 3 days
  if (status === 'familiar') {
    return new Date(now.setDate(now.getDate() + 3));
  }

  // For mastered items, find the previous interval and double it
  if (status === 'mastered') {
    const previousProgress = await prisma.learningProgress.findFirst({
      where: { vocabularyId },
      orderBy: { createdAt: 'desc' },
      select: { nextReviewDate: true, createdAt: true }
    });

    if (!previousProgress) {
      // First mastery: 7 days
      return new Date(now.setDate(now.getDate() + 7));
    }

    // Calculate the previous interval in days
    const prevInterval = Math.ceil(
      (previousProgress.nextReviewDate.getTime() - previousProgress.createdAt.getTime()) / 
      (1000 * 60 * 60 * 24)
    );

    // Double the interval for next review, cap at 60 days
    const nextInterval = Math.min(prevInterval * 2, 60);
    return new Date(now.setDate(now.getDate() + nextInterval));
  }

  // Default fallback: review tomorrow
  return new Date(now.setDate(now.getDate() + 1));
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { status } = body;
    const vocabularyId = params.id;

    // Create a new progress entry
    const progress = await prisma.learningProgress.create({
      data: {
        vocabularyId,
        status,
        nextReviewDate: await calculateNextReviewDate(status, vocabularyId),
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Failed to update progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}