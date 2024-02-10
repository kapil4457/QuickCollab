"use client";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
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
import SendIcon from "@mui/icons-material/Send";
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
import { current } from "@reduxjs/toolkit";
import { sendMessage } from "@/redux/slices/messageSlice";

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
  const {
    isAuthenticated,
    loading: selfLoading,
    user,
  } = useAppSelector((state) => state.userSlice.value);
  const { conversations, success: allConversationsSuccess } = useAppSelector(
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
  const [showMessage, setShowMessage] = useState(false);
  const [conversationNumber, setConversationNumber] = useState();
  useEffect(() => {
    dispatch(getKnownMembers());

    if (isAuthenticated === false && selfLoading === false) {
      toast.error("Please login to access this page");
      router.push("/");
    }
    if (isAuthenticated === true && selfLoading === false) {
      function onConnect() {
        setIsConnected(true);
      }

      function onDisconnect() {
        setIsConnected(false);
      }
      socket.on("recieve-message", () => {
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 5000);
      });

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      return () => {
        socket.off("recieve-message", () => {
          setShowMessage(false);
        });
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
      };
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (currentChat !== null) {
      var element = document.getElementById("chat-box")!;
      element.scrollTo({
        top: 1000,
        behavior: "smooth",
      });
      socket.emit("join-room", { roomId: currentChat._id });
    }
  }, [currentChat]);
  const sendMessageHandler = (conversation_id) => {
    socket.emit("newMessage", {
      message: newMessage,
      roomId: currentChat?._id,
    });
    dispatch(
      sendMessage({
        conversationId: conversation_id,
        body: newMessage,
      })
    );
    setNewMessage("");
  };
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
              ?.map((conversation, key: number) => {
                return (
                  <div
                    key={key}
                    className="w-full h-[4rem] cursor-pointer"
                    onClick={() => {
                      setConversationNumber(key);
                      dispatch(setCurrentChat({ conversation }));
                    }}
                  >
                    <div className="h-full flex items-center  hover:opacity-60">
                      {conversation?.isGroup === false ? (
                        <div className="flex gap-2 items-center">
                          <img
                            src={
                              user?._id.toString() ===
                              conversation?.members[1]?._id
                                ? conversation?.members[0]?.avatar?.url
                                : conversation?.members[1]?.avatar?.url
                            }
                            alt=""
                            className="h-10 w-10 object-cover"
                            style={{ borderRadius: "10px" }}
                          />
                          {user?._id.toString() ===
                          conversation?.members[1]?._id
                            ? conversation?.members[0]?.name
                            : conversation?.members[1]?.name}
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
                    src={
                      user?._id.toString() === currentChat?.members[1]?._id
                        ? currentChat?.members[0]?.avatar?.url
                        : currentChat?.members[1]?.avatar?.url
                    }
                    alt=""
                    className="h-14 w-14 object-cover"
                    style={{ borderRadius: "100%" }}
                  />
                  <Label className="text-2xl">
                    {user?._id.toString() === currentChat?.members[1]?._id
                      ? currentChat?.members[0]?.name
                      : currentChat?.members[1]?.name}
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
        <ScrollArea className="h-[calc(100vh-16rem)]  p-4 " id="chat-box">
          {currentChat === null ? (
            <div className="h-[calc(100vh-20rem)] w-full flex justify-center items-center">
              <Label className="h-full w-full flex justify-center items-center text-2xl">
                Select a profile to chat.
              </Label>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col gap-3">
              {currentChat?.messages?.map((message) => {
                return (
                  <>
                    {currentChat?.isGroup ? (
                      <div>
                        <div>
                          <img src={message?.senderId?.avatar?.url} alt="" />
                          <p>{message?.senderId?.name}</p>
                        </div>
                        <Label>{message?.body}</Label>
                      </div>
                    ) : (
                      <div
                        className="w-full flex"
                        style={{
                          justifyContent:
                            message?.senderId?._id.toString() === user?._id
                              ? "flex-end"
                              : "flex-start",
                        }}
                      >
                        <div className="flex items-center gap-2  ">
                          <img
                            src={message?.senderId?.avatar?.url}
                            alt=""
                            className="h-10 w-10 self-start"
                            style={{ borderRadius: "100%" }}
                          />
                          <Label
                            className="text-white
                          dark:bg-white
                          bg-slate-700
                          p-3
                          min-h-[3.5rem]
                          max-w-[25rem] 
                          // w-full h-full 
                          break-words
                         dark:text-black "
                            style={{ borderRadius: "10px" }}
                          >
                            {message?.body}
                          </Label>
                        </div>
                      </div>
                    )}
                  </>
                );
              })}
              {showMessage && (
                <div
                  className="bg-white w-[5rem] h-[2rem] flex justify-center items-center ml-[3rem]"
                  style={{ borderRadius: "10px" }}
                >
                  <ThreeDots
                    visible={true}
                    height="30"
                    width="30"
                    color="black"
                    radius="1"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
              )}
            </div>
          )}
        </ScrollArea>
        {currentChat !== null ? (
          <div className="h-[5rem] p-1 pl-5 pr-5 flex gap-3 items-center ">
            <AddCircleIcon className="h-[2.5rem] w-[2.5rem] cursor-pointer " />
            <Input
              placeholder="Enter your message"
              className="h-[3rem] w-[70%] focus:border-none focus:outline-none"
              value={newMessage}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessageHandler(currentChat._id);
                }
              }}
              onChange={(e) => {
                socket.emit("typing-message", { roomId: currentChat?._id });
                setNewMessage(e.target.value);
              }}
            />
            <SendIcon
              className="h-[2.5rem] w-[2.5rem] cursor-pointer bg-green-500 text-white dark:bg-slate-600 dark:text-green-300 p-2 "
              style={{ borderRadius: "100%" }}
              onClick={() => sendMessageHandler(currentChat._id)}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default page;
