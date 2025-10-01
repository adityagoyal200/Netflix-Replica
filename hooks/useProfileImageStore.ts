import { create } from 'zustand';

interface ProfileImageStore {
  selectedImage?: string;
  setSelectedImage: (src: string) => void;
}

const initialImage = typeof window !== 'undefined'
  ? (window.localStorage.getItem('selectedProfileImage') || undefined)
  : undefined;

const useProfileImageStore = create<ProfileImageStore>((set) => ({
  selectedImage: initialImage,
  setSelectedImage: (src: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('selectedProfileImage', src);
    }
    set({ selectedImage: src });
  },
}));

export default useProfileImageStore;