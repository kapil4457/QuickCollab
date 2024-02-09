"use client";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import {
  createConversationReset,
  getKnownMembers,
  setCurrentChat,
} from "@/redux/slices/chatSlice";
import { useAppSelector } from "@/redux/store";
import InfoIcon from "@mui/icons-material/Info";
import CallIcon from "@mui/icons-material/Call";
import { Button } from "@/components/ui/button";
import { io } from "socket.io-client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const URL =
    process.env.NODE_ENV === "production"
      ? undefined
      : process.env.NEXT_PUBLIC_BACKEND_URL;
  const socket = useMemo(() => io(URL as string), []);

  const dispatch = useDispatch();
  const { chat: currentChat } = useAppSelector(
    (state) => state.chatSlice.currentChat
  );
  const { isAuthenticated, loading: selfLoading } = useAppSelector(
    (state) => state.userSlice.value
  );
  const { conversations } = useAppSelector(
    (state) => state.chatSlice.allConversations
  );
  const {
    message: createConversationMessage,
    success: createConversationSuccess,
  } = useAppSelector((state) => state.chatSlice.createConversation);

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [newGroupDetails, setNewGroupDetails] = useState({
    groupName: "",
    groupImage: null,
    members: [],
  });
  const [chatFilter, setChatFilter] = useState("");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated === false && selfLoading === false) {
      toast.error("Please login to access this page");
      router.push("/");
    }
    if (isAuthenticated === true && selfLoading === false) {
      dispatch(getKnownMembers());

      function onConnect() {
        setIsConnected(true);
      }

      function onDisconnect() {
        setIsConnected(false);
      }

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
      };
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (createConversationSuccess === true) {
      toast.success(createConversationMessage);
      dispatch(createConversationReset());
      dispatch(getKnownMembers());
    } else if (createConversationSuccess === false) {
      toast.error(createConversationMessage);
    }
  }, [createConversationSuccess]);
  return (
    <div className="min-h-[calc(100vh-6rem)] grid grid-cols-10 mt-[6rem]">
      {/* <div className="chat-and-group-names border border-l-2 h-[100vh] col-span-2"></div> */}
      <div className="col-span-2 p-2 h-[calc(100vh-6rem)] border border-l-2 ">
        <div className="w-full flex gap-2">
          <Input
            placeholder="Enter a name"
            value={chatFilter}
            onChange={(e) => setChatFilter(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"secondary"}>Create a group</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[425px] md:max-w-[30rem]">
              <DialogHeader>
                <DialogTitle>Create a group</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="group-name" className="text-right">
                    Group Name
                  </Label>
                  <Input
                    id="group-name"
                    value={newGroupDetails?.groupName}
                    onChange={(e) =>
                      setNewGroupDetails({
                        ...newGroupDetails,
                        groupName: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value="@peduarte"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button>Create group</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <ScrollArea className=" h-full  p-4 flex flex-col gap-2 ">
          {conversations &&
            conversations
              ?.filter((item) => {
                if (chatFilter === "") return item;

                if (item.type === "solo") {
                  let name = item.with.name?.toLowerCase();
                  let filter = chatFilter.toLowerCase();
                  if (
                    name === filter ||
                    name?.includes(filter) ||
                    filter.includes(name as string)
                  ) {
                    return item;
                  }
                } else {
                  let name = item.groupname?.toLowerCase();
                  let filter = chatFilter.toLowerCase();
                  if (
                    name === filter ||
                    name?.includes(filter) ||
                    filter.includes(name as string)
                  ) {
                    return item;
                  }
                }
              })
              ?.map((conversation) => {
                // console.log("conversation : ", conversation);
                return (
                  <div
                    className="w-full h-[4rem] cursor-pointer"
                    onClick={() => dispatch(setCurrentChat({ conversation }))}
                  >
                    <div className="h-full flex items-center  hover:opacity-60">
                      {conversation?.isGroup === false ? (
                        <div className="flex gap-2 items-center">
                          <img
                            src={conversation?.members[0]?.avatar?.url}
                            alt=""
                            className="h-10 w-10 object-cover"
                            style={{ borderRadius: "10px" }}
                          />
                          {conversation?.members[0]?.name}
                        </div>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <img
                            src={conversation?.groupLogo?.url}
                            alt=""
                            className="h-10 w-10 object-cover"
                            style={{ borderRadius: "10px" }}
                          />
                          {conversation?.name}
                        </div>
                      )}
                    </div>
                    <Separator />
                  </div>
                );
              })}
        </ScrollArea>
      </div>
      <div className="flex flex-col col-span-8">
        <div className="h-[5rem] flex justify-between  pl-12 pr-12">
          {currentChat && (
            <>
              {currentChat.isGroup === false ? (
                <div className="flex gap-2 items-center ">
                  <img
                    src={currentChat?.members[0]?.avatar?.url}
                    alt=""
                    className="h-14 w-14 object-cover"
                    style={{ borderRadius: "100%" }}
                  />
                  <Label className="text-2xl">
                    {currentChat?.members[0]?.name}
                  </Label>
                </div>
              ) : (
                <div className="flex gap-2 items-center ">
                  <img
                    src={currentChat?.groupLogo}
                    alt=""
                    className="h-14 w-14 object-cover"
                    style={{ borderRadius: "100%" }}
                  />
                  <Label className="text-2xl">{currentChat?.groupname}</Label>
                </div>
              )}

              <div className="about-and-call flex items-center gap-5">
                <Button variant={"secondary"}>
                  <CallIcon />
                </Button>
                <Button variant={"secondary"}>
                  <InfoIcon />
                </Button>
              </div>
            </>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[calc(100vh-16rem)]  p-4 ">
          {currentChat === null ? (
            <div className="h-[calc(100vh-20rem)] w-full flex justify-center items-center">
              <Label className="h-full w-full flex justify-center items-center text-2xl">
                Select a profile to chat.
              </Label>
            </div>
          ) : (
            <></>
          )}
        </ScrollArea>
        <div className="h-[5rem] p-1 pl-5 pr-5 flex gap-3 items-center ">
          <AddCircleIcon className="h-[2.5rem] w-[2.5rem] cursor-pointer " />
          <Input
            placeholder="Enter your message"
            className="h-[3rem] w-[70%] focus:border-none focus:outline-none"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
