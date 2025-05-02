import { supabase } from '../index';
import { User, UserRole } from '../types';
import { logger } from '../utils/logger';

export class UserService {
  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) {
        logger.error('Error creating user:', error);
        throw new Error('Failed to create user');
      }

      return data as User;
    } catch (error) {
      logger.error('Error in createUser:', error);
      throw error;
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        logger.error('Error fetching user:', error);
        throw new Error('Failed to fetch user');
      }

      return data as User | null;
    } catch (error) {
      logger.error('Error in getUserById:', error);
      throw error;
    }
  }

  static async updateUser(id: string, userData: Partial<User>): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Error updating user:', error);
        throw new Error('Failed to update user');
      }

      return data as User;
    } catch (error) {
      logger.error('Error in updateUser:', error);
      throw error;
    }
  }

  static async deleteUser(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Error deleting user:', error);
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      logger.error('Error in deleteUser:', error);
      throw error;
    }
  }

  static async getUsersByRole(role: UserRole): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', role);

      if (error) {
        logger.error('Error fetching users by role:', error);
        throw new Error('Failed to fetch users by role');
      }

      return data as User[];
    } catch (error) {
      logger.error('Error in getUsersByRole:', error);
      throw error;
    }
  }

  static async getUsersByTeam(teamId: string): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('team_id', teamId);

      if (error) {
        logger.error('Error fetching users by team:', error);
        throw new Error('Failed to fetch users by team');
      }

      return data as User[];
    } catch (error) {
      logger.error('Error in getUsersByTeam:', error);
      throw error;
    }
  }
} 