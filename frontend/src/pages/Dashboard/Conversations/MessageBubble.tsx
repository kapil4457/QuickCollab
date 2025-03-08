import CustomAvatar from "@/components/CustomAvatar";
import { MessageDetail } from "@/store/dtos/helper";
import { useAppSelector } from "@/store/hooks";
import { selectLoggedInUser } from "@/store/slices/userSlice";
import { MessageType } from "@/utils/enums";
import { Button, ButtonGroup } from "@heroui/button";
import { Image } from "@heroui/image";
import clsx from "clsx";
import { Check, X } from "lucide-react";
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
  const user = useAppSelector(selectLoggedInUser);
  let isSelfMessage = user?.userId === message?.author?.userId;
  return (
    <div
      className={clsx(
        "flex gap-2  items-center w-full justify-start",
        isSelfMessage ? "flex-row-reverse" : ""
      )}
    >
      <CustomAvatar firstName={firstName} lastName={lastName} />
      <div className="rounded-md max-w-[60%]">
        {message?.isUploadRequest ? (
          <>
            <div className="flex">
              {message?.messageType === MessageType.MESSAGE.toString() ? (
                <span className="min-w-[30%] bg-red-600">
                  {message?.message}
                </span>
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
              <ButtonGroup>
                <Button className="flex gap-2 items-center justify-center">
                  Approve <Check className="bg-green-600" />
                </Button>
                <Button className="flex gap-2 items-center justify-center">
                  Decline <X />
                </Button>
              </ButtonGroup>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
