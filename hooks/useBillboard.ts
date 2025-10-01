import useSwr from 'swr'
import fetcher from '@/libs/fetcher';
import { MovieInterface } from '@/types';

const useBillboard = () => {
  const { data, error, isLoading } = useSwr<MovieInterface>('/api/random', fetcher);
  return {
    data,
    error,
    isLoading
  }
};

export default useBillboard;
