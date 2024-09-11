import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import axios from "axios";
import nookies from "nookies";
import { checkAuth } from "@/utils/auth";
import { GetServerSideProps } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

const UsersPage: React.FC<{ users: [User] }> = ({ users }) => {
  const [datausers, setUsers] = useState<User[]>(users);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const cookies = nookies.get(null);
        const response = await axios.get(`${apiUrl}/profile/me`, {
          headers: { Authorization: `Bearer ${cookies.authToken}` },
        });

        if (!response.data.email) {
          router.push("/login"); // Redirect jika tidak ada email di response
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        router.push("/login");
      }
    };

    fetchProfile();
  }, [router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
        setUsers(response.data); // Mengatur users
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${apiUrl}/users/${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
        alert("User deleted successfully.");
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow font-inter py-10">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Users</h1>
          <Link
            href="/admin/user/add"
            className="underline underline-offset-1 hover:text-blue-600"
          >
            add+
          </Link>
          <table className="min-w-full divide-y divide-gray-200 mt-5">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {datausers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link
                      href={`/admin/user/edit/${user.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="ml-4 text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = await checkAuth(ctx);

  if (!auth) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const response = await axios.get("http://localhost:3001/users", {
    headers: { Authorization: `Bearer ${nookies.get(ctx).authToken}` },
  });

  return {
    props: {
      users: response.data,
    },
  };
};

export default UsersPage;
