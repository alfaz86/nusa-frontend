import { useEffect, useState } from "react";
import nookies from "nookies";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const Profile = () => {
  const [profile, setProfile] = useState<{
    username?: string;
    email?: string;
    haveStore?: boolean;
    role?: string;
    error?: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const cookies = nookies.get(null);
      const response = await fetch(apiUrl + "/profile/me", {
        headers: { Authorization: `Bearer ${cookies.authToken}` },
      });

      const data = await response.json();
      if (data.username) {
        setProfile(data);
      } else {
        router.push("/login");
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    await fetch(apiUrl + "/auth/logout", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${nookies.get(null).authToken}` },
    });
    nookies.destroy(null, "authToken");
    router.push("/login");
  };

  const handleDashboard = () => {
    router.push("/dashboard");
  };

  const handleCreateStore = () => {
    router.push("/store/create");
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <main className="flex-grow font-inter py-10">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          {profile.error ? (
            <p>{profile.error}</p>
          ) : (
            <div>
              <p>Username: {profile.username}</p>
              <p>Email: {profile.email}</p>
              {/* check the profile.haveStore, and profile.role
              if role is admin or developer then show the dashboard button
              if true then show the dashboard button
              if false then show the create store button
              */}
              {profile.haveStore ||
              profile.role === "admin" ||
              profile.role === "developer" ? (
                <button
                  onClick={handleDashboard}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-3"
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={handleCreateStore}
                  className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mr-3"
                >
                  Create Store
                </button>
              )}
              <button
                onClick={handleLogout}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Profile;
