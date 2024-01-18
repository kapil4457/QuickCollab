"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import requestHandler from "@/utils/requestHelper";
import { setUserData } from "@/redux/slices/userSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CONTENT_CREATOR, SERVICE_PROVIDER } from "@/utils/roles";

const NavBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector(
    (state) => state.userSlice.value
  );

  const dataFetch = async () => {
    try {
      dispatch(
        setUserData({
          user: null,
          success: false,
          message: "",
          loading: true,
        })
      );

      var data = await requestHandler({}, "GET", "/api/v1/me");
      // console.clear();
      if (data?.success) {
        dispatch(
          setUserData({
            user: data?.user,
            success: data?.success,
            message: data?.message,
            isAuthenticated: true,
            loading: false,
          })
        );
      }
    } catch (err) {}
  };

  const logoutHandler = async () => {
    if (isAuthenticated) {
      const { data } = await axios.post("/api/logout");
      toast.success(data.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };
  useEffect(() => {
    if (!isAuthenticated) {
      dataFetch();
    }
  }, [isAuthenticated]);
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
          {isAuthenticated && user && user.role === SERVICE_PROVIDER ? (
            <Link href="/projects">
              <Button variant={"outline"}>Explore Projects</Button>
            </Link>
          ) : (
            <></>
          )}
          {isAuthenticated && user && user.role === CONTENT_CREATOR ? (
            <Link href="/hire">
              <Button variant={"outline"}>Hire</Button>
            </Link>
          ) : (
            <></>
          )}

          {isAuthenticated ? (
            <>
              <Avatar>
                <AvatarImage src={user?.avatar?.url} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
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
