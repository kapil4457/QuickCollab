import CustomAvatar from "@/components/CustomAvatar";
import { MessageDetail } from "@/store/dtos/helper";
import { useAppSelector } from "@/store/hooks";
import { selectLoggedInUser } from "@/store/slices/userSlice";
import { MessageType } from "@/utils/enums";
import { formatDate } from "@/utils/generalUtils";
import { Button, ButtonGroup } from "@heroui/button";
import { Image } from "@heroui/image";
import clsx from "clsx";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Video } from "reactjs-media";

const MessageBubble = ({
  firstName,
  lastName,
  message,
}: {
  firstName: string;
  lastName: string;
  message: MessageDetail;
}) => {
  const [sentOn, setSentOn] = useState("");
  const getDate = async () => {
    setSentOn(formatDate(message.sentOn));
  };
  const user = useAppSelector(selectLoggedInUser);
  let isSelfMessage = user?.userId === message?.author?.userId;

  useEffect(() => {
    getDate();
  });
  return (
    <div
      className={clsx(
        "flex gap-2  items-center w-full justify-start",
        isSelfMessage ? "flex-row-reverse" : ""
      )}
    >
      <CustomAvatar firstName={firstName} lastName={lastName} />
      <div className="rounded-md max-w-[60%]">
        <div>
          <span className="text-xs">{sentOn}</span>

          {message?.messageType === MessageType.MESSAGE.toString() ? (
            <div
              className={clsx(
                isSelfMessage ? "bg-gray-500" : "bg-sky-500",
                "p-2 rounded-md whitespace-normal break-words max-w-[30rem]"
              )}
            >
              {message?.message}
            </div>
          ) : message?.messageType === MessageType.IMAGE.toString() ? (
            <div className="flex gap-2 flex-col">
              <Image
                isZoomed
                alt="image"
                src={message?.fileUrl}
                width={500}
                height={800}
              />
              <span>{message?.description}</span>
            </div>
          ) : (
            <div className="flex gap-2 flex-col">
              <Video
                src={message?.fileUrl}
                controls={true}
                height={500}
                width={800}
              />
              <span>{message?.description}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
