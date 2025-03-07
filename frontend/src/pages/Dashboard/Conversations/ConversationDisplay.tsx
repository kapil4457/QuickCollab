import { insertMessage } from "@/store/controllers/ConversationController";
import { Conversation } from "@/store/dtos/helper";
import { MessageRequestDTO } from "@/store/dtos/request/MessageRequestDTO";
import { MessageType } from "@/utils/enums";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Plus, SendHorizontal } from "lucide-react";
import { useState } from "react";

const ConversationDisplay = ({
  conversation,
}: {
  conversation: Conversation;
}) => {
  const [message, setMessage] = useState<File | string>("");
  const [isUploadRequest, setIsUploadRequest] = useState<boolean>(false);
  const [uploadTo, setUploadTo] = useState<string[]>([]);
  const [uploadTypeMapping, setUploadTypeMapping] = useState<
    Map<string, string>
  >(new Map<string, string>());

  const sendMessage = async () => {
    const body: MessageRequestDTO = {
      conversationId: conversation?.conversationId,
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
    const {} = insertMessage(body);
  };
  return (
    <div className="h-full bg-muted/50 w-full md:w-[80%] rounded-xl p-4 flex flex-col ">
      <div className="w-full h-full">Hii</div>
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
