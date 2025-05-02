import { supabase } from '../index';
import { Attendance } from '../types';
import { logger } from '../utils/logger';

export class AttendanceService {
  static async punchIn(userId: string): Promise<Attendance> {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Check if user already punched in today
      const { data: existingAttendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today.toISOString())
        .single();

      if (existingAttendance) {
        throw new Error('User already punched in today');
      }

      const { data, error } = await supabase
        .from('attendance')
        .insert([{
          user_id: userId,
          punch_in: now,
          date: today,
        }])
        .select()
        .single();

      if (error) {
        logger.error('Error creating attendance record:', error);
        throw new Error('Failed to create attendance record');
      }

      return data as Attendance;
    } catch (error) {
      logger.error('Error in punchIn:', error);
      throw error;
    }
  }

  static async punchOut(userId: string): Promise<Attendance> {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Get today's attendance record
      const { data: attendance, error: fetchError } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today.toISOString())
        .single();

      if (fetchError) {
        logger.error('Error fetching attendance record:', fetchError);
        throw new Error('Failed to fetch attendance record');
      }

      if (!attendance) {
        throw new Error('No attendance record found for today');
      }

      if (attendance.punch_out) {
        throw new Error('User already punched out today');
      }

      // Update attendance record with punch out time
      const { data, error: updateError } = await supabase
        .from('attendance')
        .update({ punch_out: now })
        .eq('id', attendance.id)
        .select()
        .single();

      if (updateError) {
        logger.error('Error updating attendance record:', updateError);
        throw new Error('Failed to update attendance record');
      }

      return data as Attendance;
    } catch (error) {
      logger.error('Error in punchOut:', error);
      throw error;
    }
  }

  static async getAttendanceByUserId(userId: string, startDate: Date, endDate: Date): Promise<Attendance[]> {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('date', { ascending: false });

      if (error) {
        logger.error('Error fetching attendance records:', error);
        throw new Error('Failed to fetch attendance records');
      }

      return data as Attendance[];
    } catch (error) {
      logger.error('Error in getAttendanceByUserId:', error);
      throw error;
    }
  }

  static async getAttendanceByTeam(teamId: string, startDate: Date, endDate: Date): Promise<Attendance[]> {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          users!inner (
            team_id
          )
        `)
        .eq('users.team_id', teamId)
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('date', { ascending: false });

      if (error) {
        logger.error('Error fetching team attendance records:', error);
        throw new Error('Failed to fetch team attendance records');
      }

      return data as Attendance[];
    } catch (error) {
      logger.error('Error in getAttendanceByTeam:', error);
      throw error;
    }
  }
} 