# English Memory

English Memory is a web application designed to help users learn and review English vocabulary effectively. It features a spaced repetition system for optimal learning and retention.

## Features

- **Vocabulary Management**: Add new words/phrases with translations and audio pronunciations
- **Smart Review System**: Built-in spaced repetition system for efficient learning
- **Progress Tracking**: Track your learning progress with detailed statistics
- **Audio Support**: Add and play pronunciation audio for better learning
- **Responsive Design**: Works seamlessly on both desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **UI Components**: Radix UI, Recharts for statistics visualization

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd english-memory
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate deploy
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Database Schema

### VocabularyItem
- `id`: String (Primary Key)
- `text`: String (The word or phrase)
- `translation`: String
- `audioUrl`: String (Optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### LearningProgress
- `id`: String (Primary Key)
- `vocabularyId`: String (Foreign Key)
- `status`: String ("mastered", "familiar", "forgotten")
- `reviewedAt`: DateTime
- `nextReviewDate`: DateTime
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Usage

1. **Adding New Words**:
   - Click on "New" in the sidebar
   - Enter the word/phrase and its translation
   - Optionally upload pronunciation audio
   - Click "Add Vocabulary"

2. **Reviewing Words**:
   - Click on "Review" in the sidebar
   - Rate your familiarity with each word (Mastered/Familiar/Forgotten)
   - The system will schedule future reviews based on your ratings

3. **Tracking Progress**:
   - Visit the "Statistics" page to view your learning progress
   - See total words, mastery levels, and review history

## Deployment

This application can be easily deployed on [Vercel](https://vercel.com). For deployment:

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Configure environment variables if needed
4. Deploy

For other deployment options, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
