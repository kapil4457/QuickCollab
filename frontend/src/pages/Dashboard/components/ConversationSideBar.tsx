import React, { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Input } from "@heroui/input";
import { Conversation } from "@/store/dtos/helper";
import { useAppSelector } from "@/store/hooks";
import { selectLoggedInUser } from "@/store/slices/userSlice";
import { Avatar, AvatarGroup } from "@heroui/avatar";

export function ConversationSideBar({
  conversations,
  currentConversation,
  setCurrentConversation,
  filterVal,
  setFilterVal,
}: {
  conversations: Array<Conversation>;
  currentConversation: Conversation | null;
  setCurrentConversation: React.Dispatch<
    React.SetStateAction<Conversation | null>
  >;
  filterVal: string;
  setFilterVal: React.Dispatch<React.SetStateAction<string>>;
}) {
  const user = useAppSelector(selectLoggedInUser);
  return (
    <Sidebar
      side="right"
      collapsible="none"
      className="sticky hidden lg:flex top-0 h-[100vh] bottom-0 border-l w-[20rem]"
    >
      <SidebarHeader>
        <Input
          placeholder="Search here"
          value={filterVal}
          onChange={(e) => setFilterVal(e.target.value)}
        />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="p-2">
        <SidebarMenu>
          {conversations?.map((conversation) => {
            const isGroupChat = conversation?.isGroupChat;
            const groupName = conversation?.groupName;
            const otherMember = conversation.members.filter(
              (member) => member.userId != user?.userId
            );
            const initials = otherMember?.map(
              (member) =>
                member?.firstName[0]?.toUpperCase() +
                member?.lastName[0]?.toUpperCase()
            );

            return (
              <>
                <SidebarMenuItem
                  onClick={() => setCurrentConversation(conversation)}
                >
                  <SidebarMenuButton
                    size={"lg"}
                    isActive={
                      conversation?.conversationId ===
                      currentConversation?.conversationId
                    }
                  >
                    <div className="flex gap-4 mb-2 h-full items-center justify-center">
                      <div>
                        {isGroupChat ? (
                          <AvatarGroup isBordered max={3}>
                            {initials?.map((initial) => {
                              return <Avatar size="sm" name={initial} />;
                            })}
                          </AvatarGroup>
                        ) : (
                          <Avatar size="sm" isBordered name={initials[0]} />
                        )}
                      </div>
                      <div className="h-full">
                        <span className="font-bold">
                          {isGroupChat
                            ? groupName
                            : otherMember[0].firstName +
                              " " +
                              otherMember[0].lastName}
                        </span>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarSeparator />
              </>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
