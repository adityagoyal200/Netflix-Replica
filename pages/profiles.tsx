import { NextPageContext } from "next";
import { getSession} from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback } from "react";

import useCurrentUser from "@/hooks/useCurrentUser";
import useProfileImageStore from "@/hooks/useProfileImageStore";

const images = [
  '/images/profile1.jpg',
  '/images/profile2.jpg',
  '/images/profile3.jpg',
  '/images/profile4.jpg'
]

interface UserCardProps {
  name: string;
}

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

const UserCard: React.FC<UserCardProps> = ({ name }) => {
  const imgSrc = images[Math.floor(Math.random() * 4)];

  return (
    <div className="group flex-row w-48 mx-auto">
      <div className="w-48 h-48 rounded-md flex items-center justify-center ring-0 ring-white/0 group-hover:ring-2 group-hover:ring-white/40 group-hover:scale-105 transition-transform border border-white/10 overflow-hidden shadow-md">
        <img draggable={false} className="w-full h-full object-cover" src={imgSrc} alt="" />
      </div>
      <div className="mt-4 text-neutral-400 text-xl text-center group-hover:text-white transition-colors">{name}</div>
    </div>
  );
}

const App = () => {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const { setSelectedImage } = useProfileImageStore();

  const selectProfile = useCallback((img: string) => {
    setSelectedImage(img);
    router.push('/');
  }, [router, setSelectedImage]);

  return (
    <div className="flex items-center h-full justify-center bg-gradient-to-b from-black via-neutral-900 to-black">
      <div className="flex flex-col px-6">
        <h1 className="text-3xl md:text-6xl text-white text-center drop-shadow-lg">Who&#39;s Watching?</h1>
        <p className="text-neutral-400 text-center mt-3">Select your profile to continue</p>
        <div className="flex items-center justify-center gap-10 mt-10">
          <div onClick={() => selectProfile(images[0])}>
            <UserCard name={currentUser?.name || 'You'} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
