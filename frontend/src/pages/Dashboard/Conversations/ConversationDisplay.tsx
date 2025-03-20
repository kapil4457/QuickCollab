import { insertMessage } from "@/store/controllers/ConversationController";
import { Conversation } from "@/store/dtos/helper";
import { MessageRequestDTO } from "@/store/dtos/request/MessageRequestDTO";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { MessageType } from "@/utils/enums";
import showToast from "@/utils/showToast";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Calendar, Phone, Plus, SendHorizontal, Video } from "lucide-react";
import { useState } from "react";
import MessageBubble from "./MessageBubble";
import { selectAllConversations } from "@/store/slices/conversationSlice";
import { selectLoggedInUser } from "@/store/slices/userSlice";
import CustomAvatar from "@/components/CustomAvatar";
import { Snippet } from "@heroui/snippet";
const ConversationDisplay = ({
  conversationId,
}: {
  conversationId: number;
}) => {
  const [message, setMessage] = useState<File | string>("");
  const [isUploadRequest, setIsUploadRequest] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [uploadTo, setUploadTo] = useState<string[]>([]);
  const [uploadTypeMapping, setUploadTypeMapping] = useState<
    Map<string, string>
  >(new Map<string, string>());
  const dispatch = useAppDispatch();

  const conversation = useAppSelector(selectAllConversations)?.filter(
    (conversation) => conversation.conversationId === conversationId
  )[0];
  const user = useAppSelector(selectLoggedInUser);
  const otherMember = conversation?.members?.filter((member) => {
    if (member.userId != user?.userId) return true;
    return false;
  })[0];
  const conversationName = conversation?.isGroupChat
    ? conversation?.groupName == ""
      ? "Group Name"
      : conversation?.groupName
    : otherMember.firstName + " " + otherMember.lastName;

  const sendMessage = async () => {
    const body: MessageRequestDTO = {
      conversationId: conversation?.conversationId,
      description: "",
      isUploadRequest: isUploadRequest,
      message: message,
      messageType: isUploadRequest
        ? typeof message === "string"
          ? MessageType.MESSAGE
          : MessageType.IMAGE
        : typeof message === "string"
          ? MessageType.MESSAGE
          : MessageType.IMAGE,
      uploadTo: uploadTo,
      uploadTypeMapping: uploadTypeMapping,
    };
    const { success, message: responseMessage } = await insertMessage(
      dispatch,
      body
    );
    if (!success) {
      showToast({ color: "danger", title: responseMessage });
    }
    setMessage("");
  };
  return (
    <div className="h-[85%] lg:h-full bg-muted/50 w-full md:w-[60%] rounded-xl  flex flex-col ">
      <div className=" bg-slate-600 bg-opacity-75 backdrop-blur-sm p-2 md:p-4 rounded-xl rounded-b-none rounded-bl-none flex justify-between">
        <div className="flex gap-2 items-center font-semibold">
          {}
          <CustomAvatar
            firstName={
              conversation?.isGroupChat
                ? conversation?.groupName
                : otherMember?.firstName
            }
            lastName={conversation?.isGroupChat ? "" : otherMember?.lastName}
          />
          <div className="flex flex-col gap-0.5">
            <span className="relative">{conversationName}</span>
            {conversation?.isGroupChat ? (
              ""
            ) : (
              <Snippet
                size="sm"
                hideSymbol
                variant="flat"
                className="absolute h-[1.2rem] bottom-[5px] break-words"
                codeString={otherMember?.userId}
              >
                User id
              </Snippet>
            )}
          </div>
        </div>
        {/* <div className="flex gap-2">
          <Button
            variant="solid"
            size="md"
            isIconOnly
            className="p-2"
            color="primary"
          >
            <Phone />
          </Button>
          <Button
            variant="solid"
            size="md"
            isIconOnly
            className="p-2"
            color="primary"
          >
            <Video />
          </Button>
          <Button
            variant="solid"
            size="md"
            isIconOnly
            className="p-2"
            color="primary"
          >
            <Calendar />
          </Button>
        </div> */}
      </div>
      <div className="w-full h-[95%] overflow-scroll overflow-x-hidden flex flex-col gap-5 p-2 pl-2 pr-2 md:pr-4 md:pl-4 ">
        {conversation?.messages?.map((msg) => (
          <MessageBubble
            firstName={msg?.author?.firstName}
            lastName={msg?.author?.lastName}
            message={msg}
          />
        ))}
      </div>
      <div className="bg-slate-700 bg-opacity-75 backdrop-blur-sm rounded-xl rounded-t-none  w-full  flex gap-3 items-center p-2 md:p-4 pl-2 pr-2 md:pl-8 md:pr-8 lg:pl-16 lg:pr-16 ">
        <Input
          placeholder="Type your message here..."
          value={typeof message === "string" ? message : ""}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button size="sm" color="primary" isIconOnly className="p-2">
          <Plus />
        </Button>
        <Button
          size="sm"
          color="primary"
          isIconOnly
          className="p-2"
          onPress={sendMessage}
        >
          <SendHorizontal />
        </Button>
      </div>
    </div>
  );
};

export default ConversationDisplay;
