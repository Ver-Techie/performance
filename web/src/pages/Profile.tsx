import { Box, Button, Container, FormControl, FormLabel, Input, VStack, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateUserProfile } from '../services/supabase';

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await updateUserProfile(user.uid, {});
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input value={user?.email || ''} isDisabled />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={loading}
            >
              Update Profile
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
} 