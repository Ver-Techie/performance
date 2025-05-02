import { Box, Grid, Heading, Text, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { useApiQuery } from '../hooks/useApi';
import { Attendance, EODReport } from '../types';

export const Dashboard = () => {
  const { role } = useAuth();
  const { data: attendance } = useApiQuery<Attendance[]>(
    ['attendance'],
    '/attendance'
  );
  const { data: eodReports } = useApiQuery<EODReport[]>(
    ['eod-reports'],
    '/eod-reports'
  );

  const getRoleSpecificContent = () => {
    switch (role) {
      case UserRole.RECRUITER:
      case UserRole.CONSULTANT:
        return (
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            <Stat>
              <StatLabel>Today's Attendance</StatLabel>
              <StatNumber>
                {attendance?.find((a) => a.punchIn) ? 'Present' : 'Absent'}
              </StatNumber>
              <StatHelpText>
                {attendance?.find((a) => a.punchIn)?.punchIn.toLocaleTimeString()}
              </StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Today's EOD Report</StatLabel>
              <StatNumber>
                {eodReports?.length ? 'Submitted' : 'Pending'}
              </StatNumber>
              <StatHelpText>
                {eodReports?.length
                  ? `${eodReports[0].submissions} submissions`
                  : 'Not submitted yet'}
              </StatHelpText>
            </Stat>
          </Grid>
        );
      case UserRole.SUPER_ADMIN:
      case UserRole.ONSHORE_LEAD:
      case UserRole.OFFSHORE_MANAGER:
      case UserRole.OFFSHORE_LEAD:
        return (
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            <Stat>
              <StatLabel>Team Attendance</StatLabel>
              <StatNumber>
                {attendance?.filter((a) => a.punchIn).length || 0}
              </StatNumber>
              <StatHelpText>out of {attendance?.length || 0} members</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>EOD Reports</StatLabel>
              <StatNumber>{eodReports?.length || 0}</StatNumber>
              <StatHelpText>submitted today</StatHelpText>
            </Stat>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Heading mb={6}>Dashboard</Heading>
      {getRoleSpecificContent()}
    </Box>
  );
}; 