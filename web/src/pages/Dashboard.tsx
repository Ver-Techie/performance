import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user, role } = useAuth();

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading>Welcome, {user?.email}</Heading>
          <Text color="gray.600">Role: {role}</Text>
        </Box>
        <Box p={6} borderWidth={1} borderRadius={8} boxShadow="lg">
          <Heading size="md" mb={4}>
            Quick Stats
          </Heading>
          {/* Add your dashboard content here */}
        </Box>
      </VStack>
    </Container>
  );
} 