import { Box, Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const color = useColorModeValue('gray.600', 'gray.200');
  const activeColor = useColorModeValue('blue.600', 'blue.200');

  return (
    <Link
      as={RouterLink}
      to={to}
      px={2}
      py={1}
      rounded={'md'}
      color={isActive ? activeColor : color}
      _hover={{
        textDecoration: 'none',
        color: activeColor,
      }}
    >
      {children}
    </Link>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { role } = useAuth();
  const bg = useColorModeValue('white', 'gray.800');

  const getNavLinks = () => {
    const links = [
      { to: '/dashboard', label: 'Dashboard' },
    ];

    if (role === UserRole.RECRUITER || role === UserRole.CONSULTANT) {
      links.push(
        { to: '/attendance', label: 'Attendance' },
        { to: '/eod-reports', label: 'EOD Reports' },
        { to: '/job-submissions', label: 'Job Submissions' }
      );
    }

    if (
      role === UserRole.SUPER_ADMIN ||
      role === UserRole.ONSHORE_LEAD ||
      role === UserRole.OFFSHORE_MANAGER ||
      role === UserRole.OFFSHORE_LEAD
    ) {
      links.push({ to: '/team-management', label: 'Team Management' });
    }

    return links;
  };

  return (
    <Box minH="100vh" bg={bg}>
      <Box px={4} py={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Flex alignItems={'center'}>
            <Text fontSize="xl" fontWeight="bold">
              Recruitment Platform
            </Text>
          </Flex>
          <Flex alignItems={'center'} gap={4}>
            {getNavLinks().map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}
          </Flex>
        </Flex>
      </Box>
      <Box p={4}>{children}</Box>
    </Box>
  );
}; 