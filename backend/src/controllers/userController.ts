import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { UserRole } from '../types';
import { logger } from '../utils/logger';

export class UserController {
  static async createUser(req: Request, res: Response) {
    try {
      const { email, phoneNumber, firstName, lastName, role, teamId } = req.body;

      // Validate required fields
      if (!email || !phoneNumber || !firstName || !lastName || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate role
      if (!Object.values(UserRole).includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      const user = await UserService.createUser({
        email,
        phoneNumber,
        firstName,
        lastName,
        role,
        teamId,
      });

      res.status(201).json(user);
    } catch (error) {
      logger.error('Error in createUser controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      logger.error('Error in getUser controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Validate role if provided
      if (updateData.role && !Object.values(UserRole).includes(updateData.role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      const user = await UserService.updateUser(id, updateData);
      res.json(user);
    } catch (error) {
      logger.error('Error in updateUser controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      logger.error('Error in deleteUser controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getUsersByRole(req: Request, res: Response) {
    try {
      const { role } = req.params;

      if (!Object.values(UserRole).includes(role as UserRole)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      const users = await UserService.getUsersByRole(role as UserRole);
      res.json(users);
    } catch (error) {
      logger.error('Error in getUsersByRole controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getUsersByTeam(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      const users = await UserService.getUsersByTeam(teamId);
      res.json(users);
    } catch (error) {
      logger.error('Error in getUsersByTeam controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 