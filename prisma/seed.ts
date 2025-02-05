import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create some initial vocabulary items
  const items = [
    {
      text: 'Hello',
      translation: '你好',
      progress: {
        create: {
          status: 'new',
          nextReviewDate: new Date(),
        },
      },
    },
    {
      text: 'Goodbye',
      translation: '再见',
      progress: {
        create: {
          status: 'new',
          nextReviewDate: new Date(),
        },
      },
    },
    {
      text: 'Thank you',
      translation: '谢谢',
      progress: {
        create: {
          status: 'new',
          nextReviewDate: new Date(),
        },
      },
    },
  ];

  for (const item of items) {
    await prisma.vocabularyItem.create({
      data: item,
    });
  }

  console.log('Database has been seeded with initial vocabulary items');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });