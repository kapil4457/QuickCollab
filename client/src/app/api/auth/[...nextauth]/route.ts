import axios from "axios";
import NextAuth, { Account, AuthOptions, Profile, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_AUTH_GOOGLE_CLIENT as string,
      clientSecret: process.env.NEXT_AUTH_GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({
      user,
      profile,
    }: {
      user: User | AdapterUser;
      profile: Profile | null;
    }) {
      if (!profile?.email_verified) {
        return {
          success: false,
          message: "Your email id is not verified by google.",
        };
      }
      const info = {
        name: user.name,
        email: user.email,
        role: "not-decided",
        avatar: {
          url: user.image,
          isGoogleAuthImage: true,
        },
      };

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/sign-up-google`;

      // const res = await fetch(url, {
      //   method: "POST",
      //   credentials: "same-origin",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(info),
      // }).then((data) => {
      //   console.log(data.headers);
      //   console.log(data);
      //   return data.json();
      // });

      const res2 = await axios.post(url, info, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log(res2.headers["set-cookie"]);
      return res2;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
