import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { Client } from 'discord.js';
import { errorHandler } from './middlewares/errorHandler';
import { authMiddleware } from './middlewares/auth';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
const firebaseConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
};

initializeApp(firebaseConfig);
export const firebaseAuth = getAuth();

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Discord client
const discordClient = new Client({
  intents: ['Guilds', 'GuildMessages'],
});

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth').default);
app.use('/api/users', authMiddleware, require('./routes/users').default);
app.use('/api/teams', authMiddleware, require('./routes/teams').default);
app.use('/api/attendance', authMiddleware, require('./routes/attendance').default);
app.use('/api/eod-reports', authMiddleware, require('./routes/eodReports').default);
app.use('/api/job-submissions', authMiddleware, require('./routes/jobSubmissions').default);

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// Connect to Discord
discordClient.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => {
    logger.info('Discord bot connected successfully');
  })
  .catch((error) => {
    logger.error('Failed to connect to Discord:', error);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
}); 