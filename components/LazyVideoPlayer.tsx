import { lazy, Suspense } from 'react';

// Lazy load the heavy VideoPlayer component
const VideoPlayer = lazy(() => import('./VideoPlayer'));

interface LazyVideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
  muted?: boolean;
  loop?: boolean;
}

const LazyVideoPlayer: React.FC<LazyVideoPlayerProps> = (props) => {
  return (
    <Suspense fallback={
      <div className={`${props.className} bg-zinc-800 animate-pulse flex items-center justify-center`}>
        <div className="text-white text-sm">Loading video...</div>
      </div>
    }>
      <VideoPlayer {...props} />
    </Suspense>
  );
};

export default LazyVideoPlayer;
