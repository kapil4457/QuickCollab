import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SideBar } from "../pages/Dashboard/components/SideBar";
import RootLayout from "./RootLayout";

export default function DashboardLayout({
  children,
  extendedClassName = "",
}: {
  children: React.ReactNode;
  extendedClassName?: string;
}) {
  return (
    <RootLayout>
      <SidebarProvider>
        <SideBar />
        <SidebarInset>
          <SidebarTrigger className="absolute top-0 left-0" />
          <div className={`p-10 ${extendedClassName}`}>{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </RootLayout>
  );
}
