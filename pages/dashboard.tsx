import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { Dashboard as AdminDashboard } from "@/components/admin/Dashboard";

const DashboardPage: React.FC<{ role: string }> = ({ role }) => {
  switch (role) {
    case "admin":
      return <AdminDashboard />;
    case "seller":
      return <>seller</>;
    case "buyer":
      return <>buyer</>;
    default:
      return <div>Unauthorized</div>;
  }
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);
  const role = cookies.userRole || "guest";

  if (!cookies.authToken) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      role,
    },
  };
};

export default DashboardPage;
