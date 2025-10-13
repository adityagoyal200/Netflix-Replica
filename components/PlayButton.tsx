import React, { memo, useCallback } from 'react';
import { PlayIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';

interface PlayButtonProps {
  movieId: string;
}

const PlayButton: React.FC<PlayButtonProps> = memo(({ movieId }) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/watch/${movieId}`);
  }, [router, movieId]);

  return (
    <button 
      onClick={handleClick}
      className="
        bg-white 
        rounded-md 
        py-1 md:py-2 
        px-2 md:px-4
        w-auto 
        text-xs lg:text-lg 
        font-semibold
        flex
        flex-row
        items-center
        hover:bg-neutral-300
        transition
        "
      >
        <PlayIcon className="w-4 md:w-7 text-black mr-1" />
        Play
    </button>
  );
});

PlayButton.displayName = 'PlayButton';

export default PlayButton;
