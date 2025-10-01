import useSwr from 'swr'

import fetcher from '@/libs/fetcher';
import { UserInterface } from '@/types';

const useCurrentUser = () => {
  const { data, error, isLoading, mutate } = useSwr<UserInterface>('/api/current', fetcher);
  return {
    data,
    error,
    isLoading,
    mutate,
  }
};

export default useCurrentUser;
