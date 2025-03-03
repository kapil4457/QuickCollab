import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SideBar } from "../pages/Dashboard/components/SideBar";
import RootLayout from "./RootLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootLayout>
      <SidebarProvider>
        <SideBar />
        <SidebarInset>
          <SidebarTrigger />
          <div className="p-10">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </RootLayout>
  );
}
