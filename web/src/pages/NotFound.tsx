import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container maxW="container.md" py={10}>
      <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <VStack spacing={4}>
          <Heading>404</Heading>
          <Text>Page not found</Text>
          <Button colorScheme="blue" onClick={() => navigate('/')}>
            Go Home
          </Button>
        </VStack>
      </Box>
    </Container>
  );
} 