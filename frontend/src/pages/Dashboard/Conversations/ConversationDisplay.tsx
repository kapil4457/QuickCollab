import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Plus, SendHorizontal } from "lucide-react";

const ConversationDisplay = () => {
  return (
    <div className="h-full bg-muted/50 w-full rounded-xl p-2">
      <div></div>
      <div className="w-full flex gap-3 items-center pl-2 pr-2 md:pl-16 md:pr-16 ">
        <Input placeholder="Type your message here..." />
        <Button size="sm" isIconOnly className="p-2">
          <Plus />
        </Button>
        <Button size="sm" isIconOnly className="p-2">
          <SendHorizontal />
        </Button>
      </div>
    </div>
  );
};

export default ConversationDisplay;
