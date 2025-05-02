import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { roleMiddleware } from '../middlewares/auth';
import { UserRole } from '../types';

const router = Router();

// Create user (only for specific roles)
router.post(
  '/',
  roleMiddleware([UserRole.SUPER_ADMIN, UserRole.OFFSHORE_MANAGER, UserRole.OFFSHORE_LEAD]),
  UserController.createUser
);

// Get user by ID
router.get('/:id', UserController.getUser);

// Update user
router.patch(
  '/:id',
  roleMiddleware([UserRole.SUPER_ADMIN, UserRole.OFFSHORE_MANAGER, UserRole.OFFSHORE_LEAD]),
  UserController.updateUser
);

// Delete user
router.delete(
  '/:id',
  roleMiddleware([UserRole.SUPER_ADMIN]),
  UserController.deleteUser
);

// Get users by role
router.get('/role/:role', UserController.getUsersByRole);

// Get users by team
router.get('/team/:teamId', UserController.getUsersByTeam);

export default router; 