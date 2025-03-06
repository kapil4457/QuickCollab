import DashboardLayout from "@/layouts/DashboardLayout";
import { useAppSelector } from "@/store/hooks";
import { selectAllConversations } from "@/store/slices/userSlice";
import { selectLoggedInUser } from "@/store/slices/userSlice";
import { AllRoles } from "@/utils/enums";
import { Table } from "@heroui/table";
import { Tabs, Tab } from "@heroui/tabs";
import { Briefcase, User } from "lucide-react";
import { useMemo, useState } from "react";
import { ConversationSideBar } from "../components/ConversationSideBar";

const Conversations = () => {
  const user = useAppSelector(selectLoggedInUser);
  const userConversations = useAppSelector(selectAllConversations);
  const [conversationMode, setConversationMode] = useState<
    "team" | "candidates"
  >("team");

  const conversations = useMemo(() => {
    if (user?.userRole === AllRoles.CONTENT_CREATOR) {
      let filteredConversations;
      if (conversationMode === "team") {
        filteredConversations = userConversations?.filter((conversation) => {
          return conversation.isTeamMemberConversation;
        });
      } else {
        filteredConversations = userConversations?.filter((conversation) => {
          return !conversation.isTeamMemberConversation;
        });
      }

      return filteredConversations;
    }

    return userConversations;
  }, [userConversations, conversationMode, user]);
  return (
    <DashboardLayout extendedClassName="!p-0">
      <div className="flex gap-2 overflow-hidden">
        {user?.userRole === AllRoles.CONTENT_CREATOR ? (
          <div className="w-full flex justify-center items-center">
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
          </div>
        ) : null}
        <ConversationSideBar />
      </div>
    </DashboardLayout>
  );
};

export default Conversations;
