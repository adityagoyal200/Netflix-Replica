export interface MovieInterface {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  genre: string;
}

export interface UserInterface {
  id: string;
  name: string;
  image?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  favoriteIds: string[];
}
