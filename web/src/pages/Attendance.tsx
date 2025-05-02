import { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { useApiQuery, useApiMutation } from '../hooks/useApi';
import { Attendance } from '../types';

export const Attendance = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const { data: attendance, refetch } = useApiQuery<Attendance[]>(
    ['attendance'],
    '/attendance'
  );

  const punchInMutation = useApiMutation<Attendance, void>('/attendance/punch-in');
  const punchOutMutation = useApiMutation<Attendance, void>('/attendance/punch-out');

  const handlePunchIn = async () => {
    setLoading(true);
    try {
      await punchInMutation.mutateAsync();
      toast({
        title: 'Success',
        description: 'Punched in successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to punch in',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePunchOut = async () => {
    setLoading(true);
    try {
      await punchOutMutation.mutateAsync();
      toast({
        title: 'Success',
        description: 'Punched out successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to punch out',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  const todayAttendance = attendance?.find(
    (a) => new Date(a.date).toDateString() === today.toDateString()
  );

  return (
    <Box>
      <Heading mb={6}>Attendance</Heading>
      <VStack spacing={6} align="stretch">
        <Box p={4} borderWidth={1} borderRadius="md">
          <Text fontSize="lg" mb={4}>
            Today's Status: {todayAttendance ? 'Present' : 'Absent'}
          </Text>
          <Button
            colorScheme="green"
            onClick={handlePunchIn}
            isLoading={loading}
            isDisabled={!!todayAttendance?.punchIn}
            mr={4}
          >
            Punch In
          </Button>
          <Button
            colorScheme="red"
            onClick={handlePunchOut}
            isLoading={loading}
            isDisabled={!todayAttendance?.punchIn || !!todayAttendance?.punchOut}
          >
            Punch Out
          </Button>
        </Box>

        <Box>
          <Heading size="md" mb={4}>
            Attendance History
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Punch In</Th>
                <Th>Punch Out</Th>
              </Tr>
            </Thead>
            <Tbody>
              {attendance?.map((record) => (
                <Tr key={record.id}>
                  <Td>{new Date(record.date).toLocaleDateString()}</Td>
                  <Td>{record.punchIn.toLocaleTimeString()}</Td>
                  <Td>
                    {record.punchOut
                      ? record.punchOut.toLocaleTimeString()
                      : 'Not punched out'}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Box>
  );
}; 