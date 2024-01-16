"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const NavBar = () => {
  let isLoggedIn = false;
  let userType = "content-creator";
  const router = useRouter();
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

          {isLoggedIn ? (
            <Link href="/account">Account</Link>
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
