"use client";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import requestHandler from "@/utils/requestHelper";
import { logoutUser, setUserData } from "@/redux/slices/userSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CONTENT_CREATOR, SERVICE_PROVIDER } from "@/utils/roles";
import { Moon, Sun } from "lucide-react";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "next-themes";
import {
  Settings,
  Logout,
  ArrowDropDown,
  DocumentScanner,
} from "@mui/icons-material";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NavBar = () => {
  const { setTheme } = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector(
    (state) => state.userSlice.value
  );
  const { message: logoutMessage, success: logoutSuccess } = useAppSelector(
    (state) => state.userSlice.logoutUser
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
      dispatch(logoutUser());
      // const { data } = await axios.post("/api/logout");
      // toast.success(data.message);
      // setTimeout(() => {
      //   window.location.reload();
      // }, 2000);
    }
  };
  useEffect(() => {
    if (logoutSuccess === true) {
      toast.success(logoutMessage);
    } else if (logoutSuccess === false) {
      toast.error(logoutMessage);
    }
  }, [logoutSuccess]);
  useEffect(() => {
    if (!isAuthenticated) {
      dataFetch();
    }
  }, [isAuthenticated]);
  return (
    <div className="h-[6rem] w-full fixed  top-0 flex justify-center z-10 bg-slate-600 dark:bg-slate-400">
      <div className="w-[95%] h-full flex justify-between  items-center p-2">
        <div className="flex flex-col justify-center items-center ">
          <img
            src="/logo3.png"
            alt=""
            className="h-20 w-20 cursor-pointer"
            onClick={() => router.push("/")}
          />
        </div>
        <div className="gap-3 flex sm:flex md:flex lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Sheet>
            <SheetTrigger>
              <MenuIcon
                className={cn(
                  buttonVariants({
                    variant: "default",
                  }),
                  "w-10 p-2 h-10 border-2 border-slate-800 rounded-lg"
                )}
              />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription className="flex flex-col ">
                  <SheetClose
                    className="flex items-center justify-center gap-3 h-16 border-b-2 text-[1rem]"
                    onClick={() => {
                      router.push("/me");
                    }}
                  >
                    <Avatar style={{ borderRadius: "10px" }}>
                      <AvatarImage
                        alt="Profile Picture"
                        src={user?.avatar?.url}
                        style={{ borderRadius: 0 }}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {user?.name}
                  </SheetClose>
                  <SheetClose
                    className="h-16 border-b-2 text-[1rem]"
                    onClick={() => {
                      router.push("/");
                    }}
                  >
                    Home
                  </SheetClose>
                  {user && user?.role === CONTENT_CREATOR && (
                    <SheetClose
                      className="h-16 border-b-2 text-[1rem]"
                      onClick={() => {
                        router.push("/hire");
                      }}
                    >
                      Hire
                    </SheetClose>
                  )}
                  {user && user?.role === SERVICE_PROVIDER && (
                    <SheetClose
                      className="h-16 border-b-2 text-[1rem]"
                      onClick={() => {
                        router.push("/jobs");
                      }}
                    >
                      Explore Jobs
                    </SheetClose>
                  )}
                  <SheetClose
                    className="h-16 border-b-2 text-[1rem]"
                    onClick={() => {
                      router.push("/contact");
                    }}
                  >
                    Contact
                  </SheetClose>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
        <div className="gap-3 hidden sm:hidden md:hidden lg:flex ">
          <Link href="/">
            <Button variant={"outline"}>Home</Button>
          </Link>
          {isAuthenticated && user && user.role === SERVICE_PROVIDER ? (
            <Link href="/jobs">
              <Button variant={"outline"}>Explore Jobs</Button>
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
          <Link href="/contact">
            <Button variant={"outline"}>Contact</Button>
          </Link>

          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger
                  style={{ borderRadius: "5px", border: "none" }}
                  className="flex justify-between items-center focus:border-none"
                >
                  <p className={cn(buttonVariants({ variant: "default" }))}>
                    {/* {user?.name} */}
                    My Account
                    <ArrowDropDown />
                  </p>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel
                    className="flex gap-5 justify-between items-center cursor-pointer"
                    onClick={() => router.push(`/me`)}
                  >
                    <Avatar style={{ borderRadius: "10px" }}>
                      <AvatarImage
                        alt="Profile Picture"
                        src={user?.avatar?.url}
                        style={{ borderRadius: 0 }}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {/* My Account */}
                    {user?.name}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex justify-between items-center cursor-pointer  gap-5 text-gray-500 focus:text-gray-700 dark:text-white">
                    <p>Settings</p>
                    <Settings style={{ width: "1.3rem", height: "1.3rem" }} />
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex justify-between items-center cursor-pointer  gap-5 text-gray-500 focus:text-gray-700 dark:text-white">
                    Purchase History
                    <DocumentScanner
                      style={{ width: "1.3rem", height: "1.3rem" }}
                    />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logoutHandler}
                    className=" cursor-pointer flex justify-between items-center text-red-400 focus:text-red-600"
                  >
                    <p>Logout</p>
                    <Logout style={{ width: "1.3rem", height: "1.3rem" }} />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* 
              <Button variant={"destructive"} onClick={logoutHandler}>
                Logout
              </Button> */}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
