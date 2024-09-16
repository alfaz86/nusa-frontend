import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getStoreId } from "@/utils/getStoreId";
import { GetServerSideProps } from "next";
import Link from "next/link";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  image: string;
};

type ProductsPageProps = {
  products: Product[];
};

const ProductsPage: React.FC<ProductsPageProps> = ({ products }) => {
  return (
    <>
      <Navbar />
      <main className="flex-grow font-inter py-10">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Owner Store Products</h1>
          <Link
            href="/store/owner/product/add"
            className="underline underline-offset-1 hover:text-blue-600"
          >
            add+
          </Link>
          <table className="min-w-full divide-y divide-gray-200 mt-5">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <img
                      src={product.image}
                      alt="product"
                      className="object-cover rounded-md"
                      style={{ minWidth: "100px", minHeight: "100px" }}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Rp{product.price}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link
                      href={`/store/owner/product/edit/${product.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button className="ml-4 text-red-600 hover:underline">
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const storeId = await getStoreId(context);
  const res = await fetch(`${apiUrl}/products/store/${storeId}`);
  const products: Product[] = await res.json();

  return {
    props: {
      products,
    },
  };
};

export default ProductsPage;
