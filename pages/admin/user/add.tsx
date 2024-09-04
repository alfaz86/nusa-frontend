import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GetServerSideProps } from "next";
import { checkAuth } from "@/utils/auth";

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  role: yup.string().required("Role is required"),
});

type FormData = {
  username: string;
  password: string;
  email: string;
  role: string;
};

const AddUserPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    const response = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      router.push("/admin/user");
    } else {
      alert("Failed to add user");
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow font-inter py-10">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Add User</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>Username:</label>
              <input
                {...register("username")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <p className="text-red-500 mb-5">{errors.username?.message}</p>
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                {...register("password")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <p className="text-red-500 mb-5">{errors.password?.message}</p>
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                {...register("email")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <p className="text-red-500 mb-5">{errors.email?.message}</p>
            </div>
            <div>
              <label>Role:</label>
              <input
                {...register("role")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <p className="text-red-500 mb-5">{errors.role?.message}</p>
            </div>
            <button
              type="submit"
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mt-5"
            >
              Add User
            </button>
          </form>
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

  return {
    props: {},
  };
};

export default AddUserPage;
