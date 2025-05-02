import { Request, Response } from 'express';
import { AttendanceService } from '../services/attendanceService';
import { logger } from '../utils/logger';

export class AttendanceController {
  static async punchIn(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const attendance = await AttendanceService.punchIn(userId);
      res.status(201).json(attendance);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User already punched in today') {
          return res.status(400).json({ error: error.message });
        }
      }
      logger.error('Error in punchIn controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async punchOut(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const attendance = await AttendanceService.punchOut(userId);
      res.json(attendance);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'No attendance record found for today' ||
            error.message === 'User already punched out today') {
          return res.status(400).json({ error: error.message });
        }
      }
      logger.error('Error in punchOut controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAttendance(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
      }

      const attendance = await AttendanceService.getAttendanceByUserId(
        userId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(attendance);
    } catch (error) {
      logger.error('Error in getAttendance controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getTeamAttendance(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
      }

      const attendance = await AttendanceService.getAttendanceByTeam(
        teamId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(attendance);
    } catch (error) {
      logger.error('Error in getTeamAttendance controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 