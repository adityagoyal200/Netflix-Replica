import React from 'react';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';

import Navbar from '@/components/Navbar';
import Billboard from '@/components/Billboard';
import MovieList from '@/components/MovieList';
import LazyInfoModal from '@/components/LazyInfoModal';
import useMovieList from '@/hooks/useMovieList';
import useFavorites from '@/hooks/useFavorites';
import useInfoModalStore from '@/hooks/useInfoModalStore';

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

const Home = () => {
  const { data: movies = [], isLoading: moviesLoading, error: moviesError } = useMovieList();
  const { data: favorites = [], isLoading: favoritesLoading, error: favoritesError } = useFavorites();
  const {isOpen, closeModal} = useInfoModalStore();

  return (
    <>
      <LazyInfoModal visible={isOpen} onClose={closeModal} />
      <Navbar />
      <Billboard />
      <div className="pb-40">
        {(moviesLoading || favoritesLoading) && (
          <div className="px-4 md:px-12 mt-4 space-y-8">
            <div className="h-6 w-40 bg-zinc-800 animate-pulse rounded" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-[12vw] bg-zinc-800 animate-pulse rounded-md" />
              ))}
            </div>
          </div>
        )}
        {moviesError && (
          <p className="text-red-500 px-4 md:px-12">Failed to load movies.</p>
        )}
        {favoritesError && (
          <p className="text-red-500 px-4 md:px-12">Failed to load favorites.</p>
        )}
        <MovieList title="Trending Now" data={movies} />
        <MovieList title="My List" data={favorites} />
      </div>
    </>
  )
}

export default Home;
