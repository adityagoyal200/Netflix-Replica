import useSwr from 'swr'
import fetcher from '@/libs/fetcher';
import { MovieInterface } from '@/types';

const useMovies = () => {
  const { data, error, isLoading } = useSwr<MovieInterface[]>('/api/movies', fetcher);
  return {
    data,
    error,
    isLoading
  }
};

export default useMovies;
