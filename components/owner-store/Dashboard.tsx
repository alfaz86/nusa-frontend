import Link from "next/link";
import Navbar from "../Navbar";
import Footer from "../Footer";

export const Dashboard: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="flex-grow font-inter py-10">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Owner Store Dashboard</h1>
          <ul>
            <li>
              <Link
                href="/store/owner/user"
                className="underline underline-offset-1 hover:text-blue-600"
              >
                Manage Users
              </Link>
            </li>
            <li>
              <Link
                href="/store/owner/product"
                className="underline underline-offset-1 hover:text-blue-600"
              >
                Manage Products
              </Link>
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
};
