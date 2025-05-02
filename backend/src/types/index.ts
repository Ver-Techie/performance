export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ONSHORE_LEAD = 'ONSHORE_LEAD',
  OFFSHORE_MANAGER = 'OFFSHORE_MANAGER',
  OFFSHORE_LEAD = 'OFFSHORE_LEAD',
  RECRUITER = 'RECRUITER',
  CONSULTANT = 'CONSULTANT'
}

export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  teamId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  leadId: string;
  managerId: string;
  discordChannelId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendance {
  id: string;
  userId: string;
  punchIn: Date;
  punchOut?: Date;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface EODReport {
  id: string;
  userId: string;
  date: Date;
  jobApplications: {
    linkedIn: number;
    monster: number;
    zipRecruiter: number;
    glassdoor: number;
    indeed: number;
    primeVendors: number;
  };
  callsReceived: number;
  submissions: number;
  interviews: number;
  pipelineCount: number;
  screenshots: string[]; // URLs to stored screenshots
  createdAt: Date;
  updatedAt: Date;
}

export interface JobSubmission {
  id: string;
  userId: string;
  consultantId: string;
  jobTitle: string;
  company: string;
  submissionDate: Date;
  status: 'SUBMITTED' | 'INTERVIEWING' | 'OFFERED' | 'REJECTED';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
} 