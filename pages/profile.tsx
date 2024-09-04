import { useEffect, useState } from "react";
import nookies from "nookies";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Profile = () => {
  const [profile, setProfile] = useState<{
    username?: string;
    email?: string;
    error?: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const cookies = nookies.get(null);
      const response = await fetch("http://localhost:3001/profile/me", {
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
    await fetch("http://localhost:3001/auth/logout", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${nookies.get(null).authToken}` },
    });
    nookies.destroy(null, "authToken");
    router.push("/login");
  };

  const handleDashboard = () => {
    router.push("/dashboard");
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
              <button
                onClick={handleDashboard}
                className="mt-4 bg-gray-500  text-white py-2 px-4 rounded hover:bg-gray-600 mr-3"
              >
                Dashboard
              </button>
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
