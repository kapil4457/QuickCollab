import LogoutIcon from "@/components/navbar/LogoutIcon";
import UserIcon from "@/components/navbar/UserIcon";
import {
  Home,
  Briefcase,
  User,
  MessageSquareText,
  LayoutDashboard,
  FileText,
  Upload,
} from "lucide-react";

export type SiteConfig = typeof siteConfig;

{
  /*
  0 -> Everyone
  1 -> Everyone except Content Creator
  2 -> Content Creator
  3 -> Team Members and Content Creator
  */
}
export const siteConfig = {
  name: "Quick Collab",
  description: "Team Up, Dream Big",
  navItems: [
    {
      label: "Dashboard",
      href: "/dashboard",
      type: 0,
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
      label: "Dashboard",
      href: "/dashboard",
      type: 0,
      isAuthenticationRequired: true,
    },
    {
      label: "Logout",
      href: "/logout",
      type: 0,
      isAuthenticationRequired: true,
    },
    {
      label: "Login",
      href: "/login",
      type: 0,
      isAuthenticationRequired: false,
    },
  ],
  dropDownMenuItems: [
    {
      label: "Dashboard",
      logo: UserIcon,
      href: "/dashboard",
      type: 0,
    },
    {
      label: "Logout",
      logo: LogoutIcon,
      href: "/logout",
      type: 0,
    },
  ],
  sideBarMenuItems: [
    {
      label: "Home",
      href: "/",
      logo: Home,
      type: 0,
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      logo: LayoutDashboard,
      type: 0,
    },
    {
      label: "Posted Jobs",
      href: "/my-posted-jobs",
      logo: Briefcase,
      type: 2,
    },
    {
      label: "My Employees",
      href: "/my-employees",
      logo: User,
      type: 2,
    },
    {
      label: "Job market",
      href: "/all-jobs",
      logo: Briefcase,
      type: 1,
    },
    {
      label: "Applied jobs",
      href: "/applied-jobs",
      logo: Briefcase,
      type: 1,
    },
    {
      label: "My Conversations",
      href: "/my-conversations",
      logo: MessageSquareText,
      type: 0,
    },
    {
      label: "Jobs Offered",
      href: "/offered-jobs",
      logo: FileText,
      type: 2,
    },
    {
      label: "Upload Requests",
      href: "/upload-requests",
      logo: Upload,
      type: 3,
    },
  ],
  links: {
    github: "https://github.com/frontio-ai/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },

  providers: [
    {
      name: "Youtube",
      platform: "YOUTUBE",
      icon: "youtube.svg",
      id: "yt",
    },
    {
      name: "X",
      platform: "TWITTER",
      icon: "twitter.svg",
      id: "x",
    },
  ],
  services: {
    backend: "http://localhost:8080/api/v1",
  },
};
