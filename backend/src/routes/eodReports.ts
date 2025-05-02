import { Router } from 'express';
import { EODReportController } from '../controllers/eodReportController';
import { roleMiddleware } from '../middlewares/auth';
import { UserRole } from '../types';

const router = Router();

// Create EOD report (for recruiters and consultants)
router.post(
  '/',
  roleMiddleware([UserRole.RECRUITER, UserRole.CONSULTANT]),
  EODReportController.createEODReport
);

// Get user's EOD reports
router.get('/', EODReportController.getEODReport);

// Get team EOD reports (for leads and managers)
router.get(
  '/team/:teamId',
  roleMiddleware([
    UserRole.SUPER_ADMIN,
    UserRole.ONSHORE_LEAD,
    UserRole.OFFSHORE_MANAGER,
    UserRole.OFFSHORE_LEAD
  ]),
  EODReportController.getTeamEODReports
);

// Update EOD report (for recruiters and consultants)
router.patch(
  '/:id',
  roleMiddleware([UserRole.RECRUITER, UserRole.CONSULTANT]),
  EODReportController.updateEODReport
);

export default router; 