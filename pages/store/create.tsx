import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import nookies from "nookies";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const schema = yup.object().shape({
  store_name: yup.string().required("Store Name is required"),
  store_description: yup.string().required("Store Description is required"),
  store_address: yup.string().required("Store Address is required"),
  store_contact: yup.string().required("Store Contact is required"),
  store_logo: yup
    .mixed()
    .test(
      "fileRequired",
      "Store Logo is required",
      (value) => value && value.length > 0
    )
    .test(
      "fileType",
      "Unsupported File Format",
      (value) =>
        value &&
        ["image/jpeg", "image/png", "image/gif"].includes(value[0]?.type)
    ),
});

type FormData = {
  store_name: string;
  store_description: string;
  store_address: string;
  store_contact: string;
  store_logo: FileList;
};

const CreateNewStore: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file)); // Preview logo yang diunggah
    }
  };

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("store_name", data.store_name);
    formData.append("store_description", data.store_description);
    formData.append("store_address", data.store_address);
    formData.append("store_contact", data.store_contact);
    formData.append("store_logo", data.store_logo[0]);

    const cookies = nookies.get(null);
    const response = await fetch(apiUrl + "/stores", {
      method: "POST",
      headers: { Authorization: `Bearer ${cookies.authToken}` },
      body: formData,
    });
    if (response.ok) {
      router.push("/profile");
    } else {
      alert("Failed to add store");
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow font-inter py-10">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Add Store</h1>
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div>
              <label>Store Name:</label>
              <input
                {...register("store_name")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <p className="text-red-500 mb-5">{errors.store_name?.message}</p>
            </div>
            <div>
              <label>Store Description:</label>
              <input
                {...register("store_description")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <p className="text-red-500 mb-5">
                {errors.store_description?.message}
              </p>
            </div>
            <div>
              <label>Store Address:</label>
              <input
                {...register("store_address")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <p className="text-red-500 mb-5">
                {errors.store_address?.message}
              </p>
            </div>
            <div>
              <label>Store Contact:</label>
              <input
                {...register("store_contact")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <p className="text-red-500 mb-5">
                {errors.store_contact?.message}
              </p>
            </div>
            <div>
              <label>Store Logo (160x160):</label>
              <input
                type="file"
                accept="image/*"
                {...register("store_logo")}
                onChange={handleLogoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <p className="text-red-500 mb-5">{errors.store_logo?.message}</p>
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="mt-2"
                  style={{ width: 160, height: 160, objectFit: "cover" }}
                />
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mt-5"
            >
              Add Store
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CreateNewStore;
