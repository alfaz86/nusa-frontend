import axios from "axios";
import { GetServerSidePropsContext } from "next";
import nookies from "nookies";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getRole = async (ctx: GetServerSidePropsContext) => {
  const cookies = nookies.get(ctx);
  const authToken = cookies.authToken;

  if (!authToken) {
    return null;
  }

  try {
    const response = await axios.get(apiUrl + "/profile/me", {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    return response.data.role;
  } catch (error) {
    console.error("Error verifying auth:", error);
    return null;
  }
};
