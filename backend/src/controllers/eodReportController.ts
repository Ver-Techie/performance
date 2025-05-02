import { Request, Response } from 'express';
import { EODReportService } from '../services/eodReportService';
import { logger } from '../utils/logger';

export class EODReportController {
  static async createEODReport(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const {
        date,
        jobApplications,
        callsReceived,
        submissions,
        interviews,
        pipelineCount,
        screenshots,
      } = req.body;

      // Validate required fields
      if (!date || !jobApplications || !callsReceived || !submissions || !interviews || !pipelineCount) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const report = await EODReportService.createEODReport(userId, {
        date: new Date(date),
        jobApplications,
        callsReceived,
        submissions,
        interviews,
        pipelineCount,
        screenshots: screenshots || [],
      });

      res.status(201).json(report);
    } catch (error) {
      logger.error('Error in createEODReport controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getEODReport(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
      }

      const reports = await EODReportService.getEODReportsByUserId(
        userId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(reports);
    } catch (error) {
      logger.error('Error in getEODReport controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getTeamEODReports(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
      }

      const reports = await EODReportService.getEODReportsByTeam(
        teamId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(reports);
    } catch (error) {
      logger.error('Error in getTeamEODReports controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateEODReport(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const updateData = req.body;

      // Get the report to check ownership
      const report = await EODReportService.getEODReportById(id);
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      if (report.userId !== userId) {
        return res.status(403).json({ error: 'Not authorized to update this report' });
      }

      const updatedReport = await EODReportService.updateEODReport(id, updateData);
      res.json(updatedReport);
    } catch (error) {
      logger.error('Error in updateEODReport controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 