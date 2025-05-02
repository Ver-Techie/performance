import { Request, Response, NextFunction } from 'express';
import { firebaseAuth } from '../index';
import { UserRole } from '../types';
import { logger } from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        role: UserRole;
        email: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await firebaseAuth.verifyIdToken(token);
    
    // Get user role from database
    const { data: user, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', decodedToken.uid)
      .single();

    if (error || !user) {
      logger.error('User not found:', error);
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = {
      uid: decodedToken.uid,
      role: user.role,
      email: decodedToken.email || '',
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}; 