import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { Dashboard as AdminDashboard } from "@/components/admin/Dashboard";
import { Dashboard as OwnerStoreDashboard } from "@/components/owner-store/Dashboard";
import { getRole } from "@/utils/getRole";

const DashboardPage: React.FC<{ role: string }> = ({ role }) => {
  switch (role) {
    case "admin":
      return <AdminDashboard />;
    case "developer":
      return <AdminDashboard />;
    case "store_owner":
      return <OwnerStoreDashboard />;
    case "store_admin":
      return <OwnerStoreDashboard />;
    case "user":
      return <>user</>;
    default:
      return <div>Unauthorized</div>;
  }
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);
  const role = await getRole(ctx);

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
