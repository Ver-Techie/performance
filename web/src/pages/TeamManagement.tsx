import React, { useState } from 'react';
import * as Chakra from '@chakra-ui/react';
import { useApiQuery, useApiMutation } from '../hooks/useApi';
import { Team, User, UserRole } from '../types';

export const TeamManagement: React.FC = () => {
  const toast = Chakra.useToast();
  const { isOpen, onOpen, onClose } = Chakra.useDisclosure();
  const [loading, setLoading] = useState(false);

  const { data: teams, refetch: refetchTeams } = useApiQuery<Team[]>(
    ['teams'],
    '/teams'
  );

  const { data: users } = useApiQuery<User[]>(['users'], '/users');

  const createTeamMutation = useApiMutation<Team, Partial<Team>>('/teams');

  const [formData, setFormData] = useState({
    name: '',
    leadId: '',
    managerId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createTeamMutation.mutateAsync(formData);
      toast({
        title: 'Success',
        description: 'Team created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      refetchTeams();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create team',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const leads = users?.filter(
    (user) =>
      user.role === UserRole.ONSHORE_LEAD ||
      user.role === UserRole.OFFSHORE_LEAD
  );

  const managers = users?.filter(
    (user) => user.role === UserRole.OFFSHORE_MANAGER
  );

  return (
    <Chakra.Box>
      <Chakra.Heading mb={6}>Team Management</Chakra.Heading>
      <Chakra.VStack spacing={6} align="stretch">
        <Chakra.Box>
          <Chakra.Button colorScheme="blue" onClick={onOpen}>
            Create New Team
          </Chakra.Button>
        </Chakra.Box>

        <Chakra.Box>
          <Chakra.Table variant="simple">
            <Chakra.Thead>
              <Chakra.Tr>
                <Chakra.Th>Team Name</Chakra.Th>
                <Chakra.Th>Lead</Chakra.Th>
                <Chakra.Th>Manager</Chakra.Th>
                <Chakra.Th>Members</Chakra.Th>
              </Chakra.Tr>
            </Chakra.Thead>
            <Chakra.Tbody>
              {teams?.map((team) => {
                const lead = users?.find((u) => u.id === team.leadId);
                const manager = users?.find((u) => u.id === team.managerId);
                const members = users?.filter((u) => u.teamId === team.id);

                return (
                  <Chakra.Tr key={team.id}>
                    <Chakra.Td>{team.name}</Chakra.Td>
                    <Chakra.Td>
                      {lead?.firstName} {lead?.lastName}
                    </Chakra.Td>
                    <Chakra.Td>
                      {manager?.firstName} {manager?.lastName}
                    </Chakra.Td>
                    <Chakra.Td>{members?.length || 0}</Chakra.Td>
                  </Chakra.Tr>
                );
              })}
            </Chakra.Tbody>
          </Chakra.Table>
        </Chakra.Box>

        <Chakra.Modal isOpen={isOpen} onClose={onClose}>
          <Chakra.ModalOverlay />
          <Chakra.ModalContent>
            <Chakra.ModalHeader>Create New Team</Chakra.ModalHeader>
            <Chakra.ModalCloseButton />
            <Chakra.ModalBody>
              <form onSubmit={handleSubmit}>
                <Chakra.VStack spacing={4}>
                  <Chakra.FormControl isRequired>
                    <Chakra.FormLabel>Team Name</Chakra.FormLabel>
                    <Chakra.Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </Chakra.FormControl>

                  <Chakra.FormControl isRequired>
                    <Chakra.FormLabel>Team Lead</Chakra.FormLabel>
                    <Chakra.Select
                      value={formData.leadId}
                      onChange={(e) => handleInputChange('leadId', e.target.value)}
                    >
                      <option value="">Select Lead</option>
                      {leads?.map((lead) => (
                        <option key={lead.id} value={lead.id}>
                          {lead.firstName} {lead.lastName}
                        </option>
                      ))}
                    </Chakra.Select>
                  </Chakra.FormControl>

                  <Chakra.FormControl isRequired>
                    <Chakra.FormLabel>Manager</Chakra.FormLabel>
                    <Chakra.Select
                      value={formData.managerId}
                      onChange={(e) =>
                        handleInputChange('managerId', e.target.value)
                      }
                    >
                      <option value="">Select Manager</option>
                      {managers?.map((manager) => (
                        <option key={manager.id} value={manager.id}>
                          {manager.firstName} {manager.lastName}
                        </option>
                      ))}
                    </Chakra.Select>
                  </Chakra.FormControl>

                  <Chakra.Button
                    type="submit"
                    colorScheme="blue"
                    width="full"
                    isLoading={loading}
                    mt={4}
                  >
                    Create Team
                  </Chakra.Button>
                </Chakra.VStack>
              </form>
            </Chakra.ModalBody>
          </Chakra.ModalContent>
        </Chakra.Modal>
      </Chakra.VStack>
    </Chakra.Box>
  );
}; 