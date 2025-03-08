import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SideBar } from "../pages/Dashboard/components/SideBar";
import RootLayout from "./RootLayout";
import { useEffect } from "react";
import { getAllConversations } from "@/store/controllers/ConversationController";
import { useAppDispatch } from "@/store/hooks";

export default function DashboardLayout({
  children,
  extendedClassName = "",
}: {
  children: React.ReactNode;
  extendedClassName?: string;
}) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    getAllConversations(dispatch);
  }, []);
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
