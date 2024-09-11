import { GetServerSideProps } from "next";
import { checkAuth } from "@/utils/auth";
import axios from "axios";
import nookies from "nookies";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserForm from "@/components/admin/user/Form";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const EditUserPage: React.FC<{ user: User }> = ({ user }) => {
  return (
    <>
      <Navbar />
      <main className="flex-grow font-inter py-10">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Edit User</h1>
          <UserForm initialData={user} />
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

  const { id } = ctx.query;
  const response = await axios.get(`${apiUrl}/users/${id}`, {
    headers: { Authorization: `Bearer ${nookies.get(ctx).authToken}` },
  });

  return {
    props: {
      user: response.data,
    },
  };
};

export default EditUserPage;
