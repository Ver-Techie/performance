import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxW="container.md" py={10}>
          <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
            <VStack spacing={4}>
              <Heading>Something went wrong</Heading>
              <Text color="red.500">{this.state.error?.message}</Text>
              <Button
                colorScheme="blue"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </VStack>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
} 