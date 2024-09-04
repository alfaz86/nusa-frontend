import axios from "axios";
import { GetServerSidePropsContext } from "next";
import nookies from "nookies";

export const checkAuth = async (ctx: GetServerSidePropsContext) => {
  const cookies = nookies.get(ctx);
  const authToken = cookies.authToken;

  if (!authToken) {
    return null;
  }

  try {
    const response = await axios.get("http://localhost:3001/profile/me", {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error verifying auth:", error);
    return null;
  }
};
