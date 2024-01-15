import Link from "next/link";
import { Button } from "../ui/button";

const NavBar = () => {
  let isLoggedIn = false;
  let userType = "content-creator";
  return (
    <div className="h-20 w-full sticky top-0 flex justify-center ">
      <div className="w-[95%] h-full flex justify-between  p-2">
        <div className="flex flex-col justify-center items-center ">
          <img src="logo.png" alt="" className="h-10 w-20" />
        </div>
        <div className="flex gap-3">
          <Link href="/">
            <Button variant={"outline"}>Home</Button>
          </Link>
          {userType == "content-creator" ? (
            <Link href="/projects">
              <Button variant={"outline"}>Explore Projects</Button>
            </Link>
          ) : (
            <Link href="/hire">
              <Button variant={"outline"}>Hire</Button>
            </Link>
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
