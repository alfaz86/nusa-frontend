import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductList from "@/components/ProductList";

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="flex-grow font-inter py-10">
        <ProductList />
      </main>
      <Footer />
    </>
  );
};

export default Home;
