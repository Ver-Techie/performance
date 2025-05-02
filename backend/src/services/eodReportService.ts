import { supabase } from '../index';
import { EODReport } from '../types';
import { logger } from '../utils/logger';

export class EODReportService {
  static async createEODReport(userId: string, reportData: Omit<EODReport, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<EODReport> {
    try {
      const { data, error } = await supabase
        .from('eod_reports')
        .insert([{
          user_id: userId,
          ...reportData,
        }])
        .select()
        .single();

      if (error) {
        logger.error('Error creating EOD report:', error);
        throw new Error('Failed to create EOD report');
      }

      return data as EODReport;
    } catch (error) {
      logger.error('Error in createEODReport:', error);
      throw error;
    }
  }

  static async getEODReportById(id: string): Promise<EODReport | null> {
    try {
      const { data, error } = await supabase
        .from('eod_reports')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        logger.error('Error fetching EOD report:', error);
        throw new Error('Failed to fetch EOD report');
      }

      return data as EODReport | null;
    } catch (error) {
      logger.error('Error in getEODReportById:', error);
      throw error;
    }
  }

  static async getEODReportsByUserId(userId: string, startDate: Date, endDate: Date): Promise<EODReport[]> {
    try {
      const { data, error } = await supabase
        .from('eod_reports')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('date', { ascending: false });

      if (error) {
        logger.error('Error fetching EOD reports:', error);
        throw new Error('Failed to fetch EOD reports');
      }

      return data as EODReport[];
    } catch (error) {
      logger.error('Error in getEODReportsByUserId:', error);
      throw error;
    }
  }

  static async getEODReportsByTeam(teamId: string, startDate: Date, endDate: Date): Promise<EODReport[]> {
    try {
      const { data, error } = await supabase
        .from('eod_reports')
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
        logger.error('Error fetching team EOD reports:', error);
        throw new Error('Failed to fetch team EOD reports');
      }

      return data as EODReport[];
    } catch (error) {
      logger.error('Error in getEODReportsByTeam:', error);
      throw error;
    }
  }

  static async updateEODReport(id: string, reportData: Partial<EODReport>): Promise<EODReport> {
    try {
      const { data, error } = await supabase
        .from('eod_reports')
        .update(reportData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Error updating EOD report:', error);
        throw new Error('Failed to update EOD report');
      }

      return data as EODReport;
    } catch (error) {
      logger.error('Error in updateEODReport:', error);
      throw error;
    }
  }
} 