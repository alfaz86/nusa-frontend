import Link from "next/link";
import Navbar from "../Navbar";
import Footer from "../Footer";

export const Dashboard: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="flex-grow font-inter py-10">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <ul>
            <li>
              <Link
                href="/admin/user"
                className="underline underline-offset-1 hover:text-blue-600"
              >
                Manage Users
              </Link>
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
};
