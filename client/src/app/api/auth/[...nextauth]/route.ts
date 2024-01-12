import axios from "../../../api";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

interface authOptionProps {
  user: Object;
  account: Object;
}

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: object; account: object }) {
      const data = {
        user,
        account,
        provider: "google",
      };
      await axios.post("/api/v1/sign-in-google", data);
      return user;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
