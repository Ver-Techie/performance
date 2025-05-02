import { Router } from 'express';
import { AttendanceController } from '../controllers/attendanceController';
import { roleMiddleware } from '../middlewares/auth';
import { UserRole } from '../types';

const router = Router();

// Punch in (for recruiters and consultants)
router.post(
  '/punch-in',
  roleMiddleware([UserRole.RECRUITER, UserRole.CONSULTANT]),
  AttendanceController.punchIn
);

// Punch out (for recruiters and consultants)
router.post(
  '/punch-out',
  roleMiddleware([UserRole.RECRUITER, UserRole.CONSULTANT]),
  AttendanceController.punchOut
);

// Get user's attendance records
router.get('/', AttendanceController.getAttendance);

// Get team attendance records (for leads and managers)
router.get(
  '/team/:teamId',
  roleMiddleware([
    UserRole.SUPER_ADMIN,
    UserRole.ONSHORE_LEAD,
    UserRole.OFFSHORE_MANAGER,
    UserRole.OFFSHORE_LEAD
  ]),
  AttendanceController.getTeamAttendance
);

export default router; 