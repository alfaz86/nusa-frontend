import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/router";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const userSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  role: Yup.string().required("Role is required"),
});

interface User {
  id?: number;
  username: string;
  email: string;
  role: string;
}

type UserFormData = User;

const UserForm: React.FC<{ initialData?: UserFormData }> = ({
  initialData,
}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: yupResolver(userSchema),
    defaultValues: initialData || { username: "", email: "", role: "" },
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      if (initialData) {
        await axios.put(`${apiUrl}/users/${initialData.id}`, data);
      } else {
        await axios.post(`${apiUrl}/users`, data);
      }
      router.push("/admin/user");
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  return (
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
        Edit User
      </button>
    </form>
  );
};

export default UserForm;
