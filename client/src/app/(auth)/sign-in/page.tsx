"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "@/components/Loader/Loader";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUserData } from "@/redux/slices/userSlice";
import { useAppSelector } from "@/redux/store";

const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data, status } = useSession();
  const { isAuthenticated } = useAppSelector((state) => state.userSlice.value);
  const dispatch = useDispatch();
  const submitHandler = async (formData: FormData) => {
    setIsLoading(true);
    const email = formData.get("email");
    const password = formData.get("password");
    const info = {
      email,
      password,
    };

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/sign-in`,
      info,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res?.data?.success === true) {
      setIsLoading(false);
      dispatch(
        setUserData({
          user: res?.data?.user,
          success: res?.data?.success,
          message: res?.data?.message,
          isGoogleLogin: false,
          loading: false,
        })
      );
      toast.success(res?.data?.message);
    } else {
      setIsLoading(false);
      toast.error(res?.data?.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
    if (status === "authenticated") {
      dispatch(
        setUserData({
          user: data?.user,
          success: true,
          message: "Logged in successfully !!",
          isGoogleLogin: true,
          loading: false,
        })
      );
      router.push("/");
    }
  }, [status, isAuthenticated]);
  return (
    <div className="h-[90vh] w-full flex justify-center items-center">
      {isLoading === true ? <Loader /> : ""}

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action={submitHandler} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>
          <div className="w-full border border-solid border-gray/10 mt-5 mb-5 relative" />
          <Button
            variant={"default"}
            className="w-full flex justify-center items-center gap-2"
            onClick={() => signIn("google")}
          >
            <GoogleIcon />
            <span>Sign-in with Google</span>
          </Button>
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link
              href="/sign-up"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
