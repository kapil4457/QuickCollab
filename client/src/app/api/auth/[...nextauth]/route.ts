import axios from "axios";
import NextAuth, { AuthOptions, Profile, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_AUTH_GOOGLE_CLIENT as string,
      clientSecret: process.env.NEXT_AUTH_GOOGLE_SECRET as string,
    }),
    // CredentialsProvider({
    //   name: "credentials",
    //   credentials: {
    //     email: {
    //       label: "email",
    //       type: "text",
    //     },
    //     password: {
    //       label: "password",
    //       type: "password",
    //     },
    //   },
    //   async authorize(credentials) {
    //     const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/sign-up-google`;
    //     const info = {
    //       email: credentials?.email,
    //       password: credentials?.password,
    //     };
    //     const { data } = await axios.post(url, info, {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     });
    //     console.log(data);
    //     return data;
    //   },
    // }),
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

      const { data } = await axios.post(url, info, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      cookies().set("token", data.token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      return data;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
