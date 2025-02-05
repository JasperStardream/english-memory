import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { format, subDays } from 'date-fns';

export async function GET() {
  try {
    // Get total words count
    const totalWords = await prisma.vocabularyItem.count();

    // Get counts by status
    const statusCounts = await prisma.learningProgress.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    // Calculate counts for each status
    const masteredCount = statusCounts.find(c => c.status === 'mastered')?._count?.status || 0;
    const familiarCount = statusCounts.find(c => c.status === 'familiar')?._count?.status || 0;
    const forgottenCount = statusCounts.find(c => c.status === 'forgotten')?._count?.status || 0;

    // Get review history for the last 7 days
    const today = new Date();
    const sevenDaysAgo = subDays(today, 7);

    const reviewHistory = await prisma.learningProgress.groupBy({
      by: ['createdAt'],
      _count: {
        id: true
      },
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });

    // Format review history data
    const formattedHistory = reviewHistory.map(item => ({
      date: format(item.createdAt, 'MM/dd'),
      count: item._count.id
    }));

    return NextResponse.json({
      totalWords,
      masteredCount,
      familiarCount,
      forgottenCount,
      reviewHistory: formattedHistory
    });
  } catch (error) {
    console.error('Failed to fetch statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}