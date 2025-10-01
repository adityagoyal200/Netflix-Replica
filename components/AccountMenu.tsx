import { signOut } from 'next-auth/react';
import React from 'react';
import useProfileImageStore from '@/hooks/useProfileImageStore';

import useCurrentUser from '@/hooks/useCurrentUser';

interface AccountMenuProps {
  visible?: boolean;
}

const AccountMenu: React.FC<AccountMenuProps> = ({ visible }) => {
  const { data: currentUser } = useCurrentUser();
  const { selectedImage } = useProfileImageStore();

  if (!visible) {
    return null;
  }

  return (
    <div className="w-64 absolute top-14 right-0 py-4 flex-col rounded-lg border border-white/10 bg-neutral-900/80 backdrop-blur-md shadow-xl flex">
      <div className="flex flex-col gap-3 px-3">
        <div className="group/item flex flex-row gap-3 items-center w-full">
          <img className="w-10 h-10 rounded-md ring-1 ring-white/20" src={selectedImage || '/images/profile1.jpg'} alt="" />
          <div className="flex flex-col">
            <p className="text-white text-sm font-medium group-hover/item:underline">{currentUser?.name}</p>
            {currentUser?.email && (
              <p className="text-neutral-400 text-xs">{currentUser.email}</p>
            )}
          </div>
        </div>
        <a href="/profiles" className="mt-2 text-white/90 text-sm px-2 py-2 rounded-md hover:bg-white/10 transition">
          Manage Profiles
        </a>
      </div>
      <hr className="bg-white/10 border-0 h-px my-3" />
      <button
        onClick={() => signOut({ callbackUrl: '/auth?signedOut=1' })}
        className="mx-3 px-3 py-2 rounded-md text-sm text-red-400 hover:text-white hover:bg-red-600/20 transition"
      >
        Sign out of Netflix
      </button>
    </div>
  )
}

export default AccountMenu;
