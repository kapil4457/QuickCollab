import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import { Avatar } from "@heroui/avatar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import Logo from "@/components/logo/Logo";
import { Button } from "@heroui/button";
import LoginIcon from "./LoginIcon";
import { useAppSelector } from "@/store/hooks";
import { selectLoggedInUser } from "@/store/slices/userSlice";
import MessageIcon from "./MessageIcon";
import LogoutIcon from "./LogoutIcon";
import { useLocation } from "react-router-dom";

export const Navbar = () => {
  const user = useAppSelector(selectLoggedInUser);
  const location = useLocation();

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <Logo />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="basis-1/5 sm:basis-full" justify="center">
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Button
                radius="lg"
                as={Link}
                variant="light"
                color="primary"
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium font-semibold"
                )}
                href={item.href}
              >
                {item.label}
              </Button>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Button isIconOnly color="primary" variant="light">
            <ThemeSwitch />
          </Button>
          {user && (
            <>
              <Dropdown>
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    name={`${user?.firstName[0]} ${user?.lastName[0]}`}
                    src={`${user?.profilePicture}`}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="My Conversations">
                  <DropdownItem
                    key="conversation"
                    as={Link}
                    href="/conversations"
                  >
                    <div className="flex gap-3 items-center">
                      <MessageIcon />
                      <span
                        className={clsx(
                          linkStyles({ color: "foreground" }),
                          "data-[active=true]:text-primary text-sm data-[active=true]:font-medium font-semibold"
                        )}
                      >
                        My Conversations
                      </span>
                    </div>
                  </DropdownItem>

                  <DropdownItem key="logout" as={Link} href="/logout">
                    <div className="flex gap-3 items-center">
                      <LogoutIcon />
                      <span
                        className={clsx(
                          linkStyles({ color: "foreground" }),
                          "data-[active=true]:text-primary text-sm data-[active=true]:font-medium font-semibold"
                        )}
                      >
                        Logout
                      </span>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          )}

          {!user && (
            <Button
              as={Link}
              href="/login?type=login"
              variant="flat"
              color="primary"
            >
              <span
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium font-semibold"
                )}
              >
                Login
              </span>
              <LoginIcon />
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => {
            return (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  color={
                    item.href === location.pathname ? "primary" : "foreground"
                  }
                  href={item.href}
                  size="lg"
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            );
          })}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
