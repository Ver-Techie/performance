import { Box, Center, Spinner, Text } from '@chakra-ui/react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = 'Loading...' }: LoadingStateProps) => {
  return (
    <Center h="100%" minH="200px">
      <Box textAlign="center">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text mt={4} color="gray.600">
          {message}
        </Text>
      </Box>
    </Center>
  );
}; 