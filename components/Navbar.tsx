import React from "react";
import Link from "next/link";
import { FiShoppingCart, FiUser, FiSearch } from "react-icons/fi";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/router";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const Navbar: React.FC = () => {
  // const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/profile");
  };

  return (
    <nav className="bg-gray-100 w-full p-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="text-xl font-bold">
          <Link href="/">
            <img
              src={apiUrl + "/images/nusa-text.png"}
              alt="Placeholder"
              style={{ width: "72px" }}
            />
          </Link>
        </div>
        <div className="flex items-center ">
          <div className="relative w-full">
            <label className="w-full">
              <span className="sr-only">Search for products</span>
              <input
                type="text"
                placeholder="Search for products..."
                autoComplete="on"
                className="font-inter h-10 w-full rounded-md border border-neutral-300 bg-transparent bg-white px-4 py-2 pr-10 text-sm text-black placeholder:text-neutral-500 focus:border-black focus:ring-black"
                name="search"
              />
            </label>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FiSearch className="text-neutral-500" />
            </div>
          </div>
          <FiShoppingCart className="text-3xl cursor-pointer ml-6" />
          <FiUser
            className="text-3xl cursor-pointer ml-6"
            onClick={handleProfileClick}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
