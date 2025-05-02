import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '../services/api';

export function useApiQuery<T>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await api.get<T>(url);
      return data;
    },
    ...options,
  });
}

export function useApiMutation<T, V>(
  url: string,
  options?: Omit<UseMutationOptions<T, Error, V>, 'mutationFn'>
) {
  return useMutation<T, Error, V>({
    mutationFn: async (variables) => {
      const { data } = await api.post<T>(url, variables);
      return data;
    },
    ...options,
  });
}

export function useApiUpdate<T, V>(
  url: string,
  options?: Omit<UseMutationOptions<T, Error, V>, 'mutationFn'>
) {
  return useMutation<T, Error, V>({
    mutationFn: async (variables) => {
      const { data } = await api.patch<T>(url, variables);
      return data;
    },
    ...options,
  });
}

export function useApiDelete<T>(
  url: string,
  options?: Omit<UseMutationOptions<T, Error, void>, 'mutationFn'>
) {
  return useMutation<T, Error, void>({
    mutationFn: async () => {
      const { data } = await api.delete<T>(url);
      return data;
    },
    ...options,
  });
} 