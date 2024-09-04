import React, { useEffect, useState } from "react";
import { formatRupiah } from "@/utils/currencyFormatter";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetchProducts = async () => {
  const response = await fetch(`${apiUrl}/products`);
  const data = await response.json();
  return data;
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
    });
  }, []);

  return (
    <>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full max-w-6xl mx-auto">
          <img
            src={apiUrl + "/images/nusa.png"}
            alt="NUSA"
            className="w-full max-w-6xl mx-auto object-cover mb-4"
            style={{ height: "300px" }}
          />
          <h2 className="text-2xl font-bold mb-4">Product List</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Products */}
            {products.map((product: any) => (
              <div className="p-4 border rounded-md" key={product.id}>
                <img
                  src={apiUrl + product.path}
                  alt="Product"
                  className="w-full h-48 object-cover mb-2 "
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-700">{formatRupiah(product.price)}</p>
              </div>
            ))}
            {/* End Products */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductList;
