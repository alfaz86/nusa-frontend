import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { checkAuth } from "@/utils/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import nookies from "nookies";
import { useEffect, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const schema = yup.object().shape({
  name: yup.string().required("Product Name is required"),
  price: yup
    .number()
    .typeError("Product Price must be a number")
    .min(1, "Product Price must be at least 1")
    .required("Product Price is required"),
  stock: yup
    .number()
    .typeError("Product Stock must be a number")
    .min(1, "Product Stock must be at least 1")
    .required("Product Stock is required"),
  description: yup.string().required("Product Description is required"),
  image: yup
    .mixed()
    .test(
      "fileRequired",
      "Product Image is required",
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
  name: string;
  price: number;
  stock: number;
  description: string;
  image: FileList;
};

const AddProductPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [store_id, setStoreId] = useState<string | null>(null);

  useEffect(() => {
    const cookies = nookies.get(null);
    console.log(cookies);

    setStoreId(cookies.storeId);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("stock", data.stock.toString());
    formData.append("description", data.description);
    formData.append("image", data.image[0]);

    console.log(formData);

    const cookies = nookies.get(null);
    const response = await fetch(apiUrl + "/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookies.authToken}`,
      },
      body: formData,
    });
    if (response.ok) {
      router.push("/store/owner/product");
    } else {
      alert("Failed to add product");
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow font-inter py-10">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Product Name
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Product Price
              </label>
              <input
                type="number"
                id="price"
                {...register("price")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700"
              >
                Product Stock
              </label>
              <input
                type="number"
                id="stock"
                {...register("stock")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm">{errors.stock.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Product Description
              </label>
              <textarea
                id="description"
                {...register("description")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Product Image
              </label>
              <input
                type="file"
                id="image"
                {...register("image")}
                onChange={handleImageChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />
              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image.message}</p>
              )}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="mt-2"
                  style={{ width: 160, height: 160, objectFit: "cover" }}
                />
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Add Product
            </button>
          </form>
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

  return {
    props: {},
  };
};

export default AddProductPage;
