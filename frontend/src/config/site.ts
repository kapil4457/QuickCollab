import LogoutIcon from "@/components/navbar/LogoutIcon";
import MessageIcon from "@/components/navbar/MessageIcon";
import UserIcon from "@/components/navbar/UserIcon";

export type SiteConfig = typeof siteConfig;

{
  /*
  0 -> Everyone
  1 -> Everyone except Content Creator
  2 -> Content Creator
  */
}
export const siteConfig = {
  name: "Quick Collab",
  description: "Team Up, Dream Big",
  navItems: [
    {
      label: "Home",
      href: "/",
      type: 0,
      isAuthenticationRequired: false,
    },
    {
      label: "All Jobs",
      href: "/jobs",
      type: 1,
      isAuthenticationRequired: true,
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      type: 2,
      isAuthenticationRequired: true,
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
      type: 0,
      isAuthenticationRequired: false,
    },
    {
      label: "All Jobs",
      href: "/jobs",
      type: 1,
      isAuthenticationRequired: true,
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      type: 2,
      isAuthenticationRequired: true,
    },

    {
      label: "Conversations",
      href: "/conversation",
      type: 1,
      isAuthenticationRequired: true,
    },
    {
      label: "Profile",
      href: "/profile",
      type: 0,
      isAuthenticationRequired: true,
    },
    {
      label: "Logout",
      href: "/logout",
      type: 0,
      isAuthenticationRequired: true,
    },
  ],
  dropDownMenuItems: [
    {
      label: "My Profile",
      href: "/profile",
      logo: UserIcon,
      type: 0,
    },
    {
      label: "My Conversations",
      logo: MessageIcon,
      href: "/conversation",
      type: 1,
    },
    {
      label: "Logout",
      logo: LogoutIcon,
      href: "/logout",
      type: 0,
    },
  ],
  links: {
    github: "https://github.com/frontio-ai/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
  services: {
    backend: "http://localhost:8080/api/v1",
  },
};
