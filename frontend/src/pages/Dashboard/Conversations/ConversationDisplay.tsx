import { insertMessage } from "@/store/controllers/ConversationController";
import { Conversation } from "@/store/dtos/helper";
import { MessageRequestDTO } from "@/store/dtos/request/MessageRequestDTO";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { MessageType } from "@/utils/enums";
import showToast from "@/utils/showToast";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Plus, SendHorizontal } from "lucide-react";
import { useState } from "react";
import MessageBubble from "./MessageBubble";
import { selectAllConversations } from "@/store/slices/conversationSlice";

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
    <div className="h-[85%] lg:h-full bg-muted/50 w-full md:w-[60%] rounded-xl p-2 md:p-4 flex flex-col gap-4">
      <div className="w-full h-[95%] overflow-scroll overflow-x-hidden p-2 flex flex-col gap-5 ">
        {conversation?.messages?.map((msg) => (
          <MessageBubble
            firstName={msg?.author?.firstName}
            lastName={msg?.author?.lastName}
            message={msg}
          />
        ))}
      </div>
      <div className="w-full  flex gap-3 items-center pl-2 pr-2 md:pl-8 md:pr-8 lg:pl-16 lg:pr-16 ">
        <Input
          placeholder="Type your message here..."
          value={typeof message === "string" ? message : ""}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button size="sm" isIconOnly className="p-2">
          <Plus />
        </Button>
        <Button size="sm" isIconOnly className="p-2" onPress={sendMessage}>
          <SendHorizontal />
        </Button>
      </div>
    </div>
  );
};

export default ConversationDisplay;
