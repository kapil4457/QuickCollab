import DashboardLayout from "@/layouts/DashboardLayout";
import { useAppSelector } from "@/store/hooks";
// import { selectAllConversations } from "@/store/slices/userSlice";
import { selectLoggedInUser } from "@/store/slices/userSlice";
import { AllRoles } from "@/utils/enums";
import { Tabs, Tab } from "@heroui/tabs";
import { Briefcase, User } from "lucide-react";
import { useMemo, useState } from "react";
import { ConversationSideBar } from "../components/ConversationSideBar";
import { Conversation } from "@/store/dtos/helper";
import ConversationDisplay from "./ConversationDisplay";
import { selectAllConversations } from "@/store/slices/conversationSlice";

const Conversations = () => {
  const user = useAppSelector(selectLoggedInUser);
  const userConversations = useAppSelector(selectAllConversations);
  const [conversationMode, setConversationMode] = useState<
    "team" | "candidates"
  >("team");
  const [filterVal, setFilterVal] = useState<string>("");

  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);

  const conversations = useMemo(() => {
    let currConversations = userConversations;
    if (filterVal !== "") {
      let currFilterVal = filterVal.toLowerCase().trim();
      currConversations = currConversations?.filter((conversation) => {
        let members = conversation.members.filter(
          (member) =>
            member.firstName.toLowerCase().includes(currFilterVal) ||
            currFilterVal.includes(member.firstName.toLowerCase()) ||
            member.lastName.toLowerCase().includes(currFilterVal) ||
            currFilterVal.includes(member.lastName.toLowerCase())
        );
        if (
          members.length > 0 ||
          conversation.groupName.toLowerCase().includes(currFilterVal) ||
          currFilterVal.includes(conversation.groupName.toLowerCase())
        ) {
          return true;
        }
      });
    }
    if (user?.userRole === AllRoles.CONTENT_CREATOR) {
      let filteredConversations;
      if (conversationMode === "team") {
        filteredConversations = currConversations?.filter((conversation) => {
          return conversation.isTeamMemberConversation;
        });
      } else {
        filteredConversations = currConversations?.filter((conversation) => {
          return !conversation.isTeamMemberConversation;
        });
      }

      return filteredConversations || [];
    }
    return currConversations || [];
  }, [userConversations, conversationMode, user, filterVal]);
  return (
    <DashboardLayout extendedClassName="!p-0">
      <div className="flex gap-2  overflow-hidden w-full">
        <div className="w-full flex items-center p-4 gap-2 md:gap-4  flex-col h-[100vh]  overflow-hidden">
          {user?.userRole === AllRoles.CONTENT_CREATOR ? (
            <Tabs
              aria-label="Options"
              color="primary"
              variant="solid"
              radius="full"
              selectedKey={conversationMode}
              onSelectionChange={(e) =>
                setConversationMode(e as "team" | "candidates")
              }
            >
              <Tab
                key="team"
                title={
                  <div className="flex items-center space-x-2">
                    <User />
                    <span>Team</span>
                  </div>
                }
              />
              <Tab
                key="candidates"
                title={
                  <div className="flex items-center space-x-2">
                    <Briefcase />
                    <span>Candidates</span>
                  </div>
                }
              />
            </Tabs>
          ) : null}
          <div className="h-[calc(min(100vh,90%))] w-full flex  items-center justify-center">
            {currentConversation === null ? (
              <div className="flex h-full justify-center items-center text-gray-500 font-semibold text-2xl font-sans">
                Please select a conversation
              </div>
            ) : (
              <ConversationDisplay
                conversationId={currentConversation?.conversationId}
              />
            )}
          </div>
        </div>
        <ConversationSideBar
          currentConversation={currentConversation}
          setCurrentConversation={setCurrentConversation}
          conversations={conversations}
          filterVal={filterVal}
          setFilterVal={setFilterVal}
        />
      </div>
    </DashboardLayout>
  );
};

export default Conversations;
