import useSwr from 'swr'
import fetcher from '@/libs/fetcher';
import { MovieInterface } from '@/types';

const useMovie = (id?: string) => {
  const { data, error, isLoading } = useSwr<MovieInterface>(id ? `/api/movies/${id}` : null, fetcher);
  return {
    data,
    error,
    isLoading
  }
};

export default useMovie;
