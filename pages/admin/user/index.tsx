import { GetServerSideProps } from "next";
import { checkAuth } from "@/utils/auth";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import axios from "axios";
import nookies from "nookies";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

const UsersPage: React.FC<{ users: [User] }> = ({ users }) => {
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user: User) => (
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
  const profile = await checkAuth(ctx);

  if (!profile) {
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
