import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { loggedInUser } from "@/store/dtos/response/LoginResponseDTO";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@heroui/link";
import { MoonFilledIcon, SunFilledIcon } from "@/components/icons";
import { useTheme } from "@heroui/use-theme";

export function SideBarUser({ user }: { user: loggedInUser }) {
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();

  return (
    <SidebarMenu>
      <SidebarMenuItem key="Theme Switcher">
        <SidebarMenuButton
          isActive
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="flex justify-between p-4 pb-6 pt-6 items-center"
        >
          <span>{theme === "light" ? "Light mode" : "Dark Mode"}</span>
          {theme === "light" ? (
            <MoonFilledIcon size={22} />
          ) : (
            <SunFilledIcon size={22} />
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user?.profilePicture}
                  alt={`${user?.firstName} ${user?.lastName}`}
                />
                <AvatarFallback className="rounded-lg">
                  {`${user?.firstName[0]}${user?.lastName[0]}`}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.firstName}
                  {user?.lastName}
                </span>
                <span className="truncate text-xs">{user?.emailId}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.profilePicture}
                    alt={`${user?.firstName} ${user?.lastName}`}
                  />
                  <AvatarFallback className="rounded-lg">
                    {`${user?.firstName[0]}${user?.lastName[0]}`}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="truncate text-xs">{user?.emailId}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/logout" className="w-full">
                <DropdownMenuItem className="w-full cursor-pointer">
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/logout" className="w-full">
                <DropdownMenuItem className="w-full cursor-pointer">
                  <BadgeCheck />
                  My Acount
                </DropdownMenuItem>
              </Link>
              <Link href="/logout" className="w-full">
                <DropdownMenuItem className="w-full cursor-pointer">
                  <CreditCard />
                  Billing
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <Link href="/logout" className="w-full">
              <DropdownMenuItem className="w-full cursor-pointer">
                <LogOut />
                Log out
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
