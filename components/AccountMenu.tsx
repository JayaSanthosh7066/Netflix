import { signOut } from "next-auth/react";
import React from "react";
import { useRouter } from "next/router";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

import useCurrentUser from "@/hooks/useCurrentUser";

interface AccountMenuProps {
  visible?: boolean;
}

const AccountMenu: React.FC<AccountMenuProps> = ({ visible }) => {
  const { data: currentUser } = useCurrentUser();
  const router = useRouter();

  if (!visible) {
    return null;
  }

  return (
    <div className="bg-black w-56 absolute top-14 right-0 py-5 flex-col border-2 border-gray-800 flex rounded-md shadow-xl">
      <div className="flex flex-col gap-3">
        <div className="px-3 group/item flex flex-row gap-3 items-center w-full">
          <img
            className="w-8 rounded-md"
            src="/images/default-blue.png"
            alt=""
          />
          <p className="text-white text-sm group-hover/item:underline">
            {currentUser?.name}
          </p>
        </div>
      </div>

      <hr className="bg-gray-600 border-0 h-px my-4" />

      <div
        onClick={() => router.push("/admin")}
        className="px-3 py-2 flex items-center gap-3 text-white text-sm cursor-pointer hover:bg-zinc-800 transition"
      >
        <Cog6ToothIcon className="w-5 h-5" />
        <span>Admin Dashboard</span>
      </div>

      <div
        onClick={() => signOut()}
        className="px-3 py-2 text-white text-sm cursor-pointer hover:bg-zinc-800 transition"
      >
        Sign out of Netflix
      </div>
    </div>
  );
};

export default AccountMenu;
