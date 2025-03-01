import { MoonFilledIcon, SunFilledIcon } from "@/components/icons";
import Logo from "@/components/logo/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAppSelector } from "@/store/hooks";
import { selectLoggedInUser } from "@/store/slices/userSlice";
import { siteConfig } from "@/config/site";

import { Link } from "@heroui/link";
import { useLocation } from "react-router-dom";
import { SideBarUser } from "./SideBarUser";
import LogoInitials from "@/components/logo/LogoInitials";

export function SideBar({ ...props }) {
  const { open, isMobile } = useSidebar();
  const user = useAppSelector(selectLoggedInUser);
  const location = useLocation();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarHeader>
          {open ? isMobile ? <Logo /> : <Logo /> : <LogoInitials />}
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {siteConfig.sideBarMenuItems.map((item) => {
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname == item.href}
                    >
                      <Link href={item.href}>
                        <item.logo />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SideBarUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
