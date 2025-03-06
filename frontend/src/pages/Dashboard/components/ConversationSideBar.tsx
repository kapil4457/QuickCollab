import React, { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Input } from "@heroui/input";

export function ConversationSideBar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [filterVal, setFilterVal] = useState<string>("");
  return (
    <Sidebar
      side="right"
      collapsible="none"
      className="sticky hidden lg:flex top-0 h-[100vh] bottom-0 border-l w-[20rem]"
      {...props}
    >
      <SidebarHeader>
        <Input
          placeholder="Search here"
          value={filterVal}
          onChange={(e) => setFilterVal(e.target.value)}
        />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="p-2"></SidebarContent>
    </Sidebar>
  );
}
