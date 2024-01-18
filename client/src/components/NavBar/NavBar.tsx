"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import requestHandler from "@/utils/requestHelper";
import { setUserData } from "@/redux/slices/userSlice";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";

const NavBar = () => {
  const dispatch = useDispatch();
  const { data: Data, status } = useSession();
  let isLoggedIn = false;
  let userType = "content-creator";
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.userSlice.value);

  const dataFetch = async () => {
    console.log("status  : ", status);
    dispatch(
      setUserData({
        user: null,
        success: false,
        message: "",
        loading: true,
      })
    );
    if (status === "authenticated") {
      dispatch(
        setUserData({
          user: Data.user,
          success: true,
          message: "",
          loading: false,
        })
      );
    }

    var { data } = await requestHandler({}, "GET", "/api/v1/me");
    if (data?.success) {
      dispatch(
        setUserData({
          user: data?.user,
          success: data?.success,
          message: data?.message,
          loading: false,
        })
      );
    }
  };

  const logoutHandler = async () => {
    if (status === "authenticated") {
      signOut();
      toast.success("Logged out successfully.");
      return;
    }
    if (isAuthenticated) {
      const { data } = await axios.post("/api/logout");
      toast.success(data.message);
    }
  };
  useEffect(() => {
    dataFetch();
  }, [status]);
  return (
    <div className="h-[10vh] w-full  top-0 flex justify-center">
      <div className="w-[95%] h-full flex justify-between  items-center p-2">
        <div className="flex flex-col justify-center items-center ">
          <img
            src="logo3.png"
            alt=""
            className="h-20 w-20 cursor-pointer"
            onClick={() => router.push("/")}
          />
        </div>
        <div className="flex gap-3">
          <Link href="/">
            <Button variant={"outline"}>Home</Button>
          </Link>
          {isLoggedIn ? (
            <>
              {userType == "content-creator" ? (
                <Link href="/projects">
                  <Button variant={"outline"}>Explore Projects</Button>
                </Link>
              ) : (
                <Link href="/hire">
                  <Button variant={"outline"}>Hire</Button>
                </Link>
              )}
            </>
          ) : (
            <></>
          )}

          {isAuthenticated ? (
            <>
              <Link href="/account">
                <Button variant={"outline"}>Account</Button>
              </Link>
              <Button variant={"destructive"} onClick={logoutHandler}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant={"outline"}>Sign-in</Button>
              </Link>

              <Link href="/sign-up">
                <Button variant={"outline"}>Sign-up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
