"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import requestHandler from "@/utils/requestHelper";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "@/components/Loader/Loader";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { setUserData } from "@/redux/slices/userSlice";
const SignUpPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.userSlice.value);
  const dispatch = useDispatch();

  async function submitHandler(formData: FormData) {
    setIsLoading(true);
    // Uplading the image
    const file = formData.get("avatar") as File;
    //api.cloudinary.com/v1_1/:cloud_name/image/upload
    const formData2 = new FormData();
    const api_key = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string;
    formData2.append("file", file);
    formData2.append("upload_preset", "content_management_system");
    formData2.append("folder", "profile_pics");
    const signatureRequest = await requestHandler(
      "",
      "GET",
      "/api/v1/get-signature?folder=profile_pics"
    );
    formData2.append("signature", signatureRequest.signature);
    formData2.append("timestamp", signatureRequest.timestamp);
    formData2.append("api_key", api_key as string);

    // Check if the user already exists

    const checkEmail = formData.get("email");
    const checkUrl = `/api/v1/check/user?email=${checkEmail}`;

    const check = await requestHandler({}, "GET", checkUrl);
    if (check.success == false) {
      setIsLoading(false);
      toast.error(check.message);
      return;
    }

    toast.loading("Registration initialized...", {
      duration: 2000,
      style: {
        backgroundColor: "orange",
        color: "white",
      },
    });
    // toast.success("Uploading the Picture");
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData2
    );

    let image = {
      asset_id: data.asset_id,
      public_id: data.public_id,
      version: data.version,
      version_id: data.version_id,
      signature: data.signature,
      width: data.width,
      height: data.height,
      format: data.format,
      resource_type: data.resource_type,
      created_at: data.created_at,
      type: data.type,
      etag: data.etag,
      url: data.url,
      folder: data.folder,
      original_filename: data.original_filename,
    };
    const info = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
      avatar: image,
    };

    // const res = await axios.post(
    //   `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/sign-up`,
    //   info,

    //   {
    //     withCredentials: true,
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }

    //   // "POST",
    // );
    const res = await requestHandler(info, "POST", "/api/v1/sign-up");

    if (res.success === true) {
      setIsLoading(false);
      toast.success(res.message);
      dispatch(
        setUserData({
          user: res?.user,
          success: res?.success,
          message: res?.message,
          loading: false,
        })
      );
    } else {
      setIsLoading(false);
      toast.error(res.message);
    }
  }

  useEffect(() => {
    if (isAuthenticated === true) {
      router.push("/");
    }
  }, [isAuthenticated]);
  return (
    <div className="h-[100%] w-full flex justify-center items-center">
      {isLoading === true ? <Loader /> : ""}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action={submitHandler} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                />
              </div>
            </div>

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
              <div className="flex items-center justify-between">
                <label
                  htmlFor="avatar"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Profile Image
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  autoComplete="current-avatar"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Role
                </label>
              </div>
              <Select id="role" name="role">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content-creator">
                    Content Creator
                  </SelectItem>
                  <SelectItem value="service-provider">
                    Service Provider
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign Up
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
