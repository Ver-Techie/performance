import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  VStack,
  Heading,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { useApiQuery, useApiMutation } from '../hooks/useApi';
import { EODReport } from '../types';

export const EODReports = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const { data: reports, refetch } = useApiQuery<EODReport[]>(
    ['eod-reports'],
    '/eod-reports'
  );

  const createReportMutation = useApiMutation<EODReport, Partial<EODReport>>(
    '/eod-reports'
  );

  const [formData, setFormData] = useState({
    jobApplications: {
      linkedIn: 0,
      monster: 0,
      zipRecruiter: 0,
      glassdoor: 0,
      indeed: 0,
      primeVendors: 0,
    },
    callsReceived: 0,
    submissions: 0,
    interviews: 0,
    pipelineCount: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createReportMutation.mutateAsync({
        ...formData,
        date: new Date(),
      });
      toast({
        title: 'Success',
        description: 'EOD report submitted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit EOD report',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleJobApplicationChange = (platform: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      jobApplications: {
        ...prev.jobApplications,
        [platform]: value,
      },
    }));
  };

  return (
    <Box>
      <Heading mb={6}>EOD Reports</Heading>
      <VStack spacing={6} align="stretch">
        <Box p={4} borderWidth={1} borderRadius="md">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Heading size="md">Job Applications</Heading>
              <FormControl>
                <FormLabel>LinkedIn</FormLabel>
                <NumberInput
                  value={formData.jobApplications.linkedIn}
                  onChange={(_, value) =>
                    handleJobApplicationChange('linkedIn', value)
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Monster</FormLabel>
                <NumberInput
                  value={formData.jobApplications.monster}
                  onChange={(_, value) =>
                    handleJobApplicationChange('monster', value)
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>ZipRecruiter</FormLabel>
                <NumberInput
                  value={formData.jobApplications.zipRecruiter}
                  onChange={(_, value) =>
                    handleJobApplicationChange('zipRecruiter', value)
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Glassdoor</FormLabel>
                <NumberInput
                  value={formData.jobApplications.glassdoor}
                  onChange={(_, value) =>
                    handleJobApplicationChange('glassdoor', value)
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Indeed</FormLabel>
                <NumberInput
                  value={formData.jobApplications.indeed}
                  onChange={(_, value) =>
                    handleJobApplicationChange('indeed', value)
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Prime Vendors</FormLabel>
                <NumberInput
                  value={formData.jobApplications.primeVendors}
                  onChange={(_, value) =>
                    handleJobApplicationChange('primeVendors', value)
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <Heading size="md" mt={4}>
                Other Metrics
              </Heading>
              <FormControl>
                <FormLabel>Calls Received</FormLabel>
                <NumberInput
                  value={formData.callsReceived}
                  onChange={(_, value) => handleInputChange('callsReceived', value)}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Submissions</FormLabel>
                <NumberInput
                  value={formData.submissions}
                  onChange={(_, value) => handleInputChange('submissions', value)}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Interviews</FormLabel>
                <NumberInput
                  value={formData.interviews}
                  onChange={(_, value) => handleInputChange('interviews', value)}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Pipeline Count</FormLabel>
                <NumberInput
                  value={formData.pipelineCount}
                  onChange={(_, value) =>
                    handleInputChange('pipelineCount', value)
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={loading}
                mt={4}
              >
                Submit Report
              </Button>
            </VStack>
          </form>
        </Box>

        <Box>
          <Heading size="md" mb={4}>
            Previous Reports
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Submissions</Th>
                <Th>Interviews</Th>
                <Th>Pipeline</Th>
              </Tr>
            </Thead>
            <Tbody>
              {reports?.map((report) => (
                <Tr key={report.id}>
                  <Td>{new Date(report.date).toLocaleDateString()}</Td>
                  <Td>{report.submissions}</Td>
                  <Td>{report.interviews}</Td>
                  <Td>{report.pipelineCount}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Box>
  );
}; 