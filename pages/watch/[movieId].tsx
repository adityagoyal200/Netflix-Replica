import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import useMovie from '@/hooks/useMovie';
import VideoPlayer from '@/components/VideoPlayer';

const Watch = () => {
  const router = useRouter();
  const { movieId } = router.query;

  const { data } = useMovie(movieId as string);
  
  return (
    <div className="h-screen w-screen bg-black">
      <nav className="fixed w-full p-4 z-20 flex flex-row items-center gap-8 bg-black bg-opacity-70">
        <ArrowLeftIcon onClick={() => router.push('/')} className="w-4 md:w-10 text-white cursor-pointer hover:opacity-80 transition" />
        <p className="text-white text-1xl md:text-3xl font-bold">
          <span className="font-light">Watching:</span> {data?.title}
        </p>
      </nav>
      <VideoPlayer 
        src={data?.videoUrl || ''} 
        autoPlay 
        className="h-full w-full"
      />
    </div>
  )
}

export default Watch;
