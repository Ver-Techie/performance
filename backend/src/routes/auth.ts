import { Router } from 'express';
import { body } from 'express-validator';
import { firebaseAuth } from '../index';
import { UserRole } from '../types';
import { logger } from '../utils/logger';

const router = Router();

// Login with Firebase
router.post('/login', async (req, res) => {
  try {
    const { idToken, role } = req.body;

    if (!idToken || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify Firebase token
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    
    // Check if user exists in database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decodedToken.uid)
      .single();

    if (error) {
      logger.error('Database error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify role matches
    if (user.role !== role) {
      return res.status(403).json({ error: 'Invalid role' });
    }

    // Generate custom token for role-based access
    const customToken = await firebaseAuth.createCustomToken(decodedToken.uid, {
      role: user.role,
    });

    res.json({
      token: customToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const decodedToken = await firebaseAuth.verifyIdToken(token);
    
    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decodedToken.uid)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    logger.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router; 