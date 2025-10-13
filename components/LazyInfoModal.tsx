import { lazy, Suspense } from 'react';

// Lazy load the InfoModal component
const InfoModal = lazy(() => import('./InfoModal'));

interface LazyInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

const LazyInfoModal: React.FC<LazyInfoModalProps> = (props) => {
  if (!props.visible) return null;

  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-zinc-900 rounded-lg p-8 animate-pulse">
          <div className="w-96 h-64 bg-zinc-800 rounded"></div>
        </div>
      </div>
    }>
      <InfoModal {...props} />
    </Suspense>
  );
};

export default LazyInfoModal;
