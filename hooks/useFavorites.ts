import useSwr from 'swr'
import fetcher from '@/libs/fetcher';
import { MovieInterface } from '@/types';

const useMovies = () => {
  const { data, error, isLoading, mutate } = useSwr<MovieInterface[]>('/api/favorites', fetcher);
  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useMovies;
