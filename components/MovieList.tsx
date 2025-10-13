import React, { memo, useMemo } from 'react';

import { MovieInterface } from '@/types';
import MovieCard from '@/components/MovieCard';
import { isEmpty } from 'lodash';

interface MovieListProps {
  data: MovieInterface[];
  title: string;
}

const MovieList: React.FC<MovieListProps> = memo(({ data, title }) => {
  const movieCards = useMemo(() => {
    return data.map((movie) => (
      <MovieCard key={movie.id} data={movie} />
    ));
  }, [data]);

  if (isEmpty(data)) {
    return null;
  }

  return (
    <div className="px-4 md:px-12 mt-4 space-y-8">
      <div>
        <p className="text-white text-md md:text-xl lg:text-2xl font-semibold mb-4">{title}</p>
        <div className="grid grid-cols-4 gap-2">
          {movieCards}
        </div>
      </div>
    </div>
  );
});

MovieList.displayName = 'MovieList';

export default MovieList;
