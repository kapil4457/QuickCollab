"use client";

import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  createConversation,
  createConversationReset,
  getConversations,
  getKnownMembers,
  setConversation,
  setCurrentChat,
} from "@/redux/slices/chatSlice";
import { useAppSelector } from "@/redux/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { sendMessage } from "@/redux/slices/messageSlice";
import { CONTENT_CREATOR } from "@/utils/roles";

const page = () => {
  const router = useRouter();
  const {
    isAuthenticated,
    loading: selfLoading,
    user,
  } = useAppSelector((state) => state.userSlice.value);

  // let socket;
  const [socket, setSocket] = useState(null);

  // let tempSocket = useMemo(() => {
  //   return io(URL as string, {
  //     auth: {
  //       token: user,
  //     },
  //   });
  // }, []);

  const { conversations, success: allConversationsSuccess } = useAppSelector(
    (state) => state.chatSlice.allConversations
  );
  const URL =
    process.env.NODE_ENV === "production"
      ? undefined
      : process.env.NEXT_PUBLIC_BACKEND_URL;

  const dispatch = useDispatch();

  const { chat: currentChat } = useAppSelector(
    (state) => state.chatSlice.currentChat
  );

  const {
    message: createConversationMessage,
    success: createConversationSuccess,
  } = useAppSelector((state) => state.chatSlice.createConversation);

  const { knownMembers } = useAppSelector(
    (state) => state.chatSlice.allknownMembers
  );

  // const [isConnected, setIsConnected] = useState(socket.connected);
  const [newGroupDetails, setNewGroupDetails] = useState({
    groupName: "",
    members: [],
    associatedProject: "",
  });
  const [isTyping, setIsTyping] = useState(false);
  const [typerName, setTyperName] = useState("");
  const [typerConversationId, sendTyperConversationId] = useState("");
  const [chatFilter, setChatFilter] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newGroupMember, setNewGroupMember] = useState("");
  const [conversationNumber, setConversationNumber] = useState();

  const sendMessageHandler = (conversation_id) => {
    if (!socket) {
      toast.error("Internal Server error");
      return;
    }
    if (!user) {
      toast.error("Please login first..");
      return;
    }
    socket.emit("new_message", {
      message: { type: "text", content: newMessage },
      conversationId: currentChat?._id,
      userName: user?.name,
      senderId: user?._id,
    });
    // dispatch(
    //   sendMessage({
    //     conversationId: conversation_id,
    //     body: newMessage,
    //   })
    // );
    setNewMessage("");
  };

  const createGroupHandler = async () => {
    const info = {
      name: newGroupDetails.groupName,
      isGroup: true,
      associatedProject: newGroupDetails?.associatedProject,
      members: newGroupDetails.members,
    };

    if (info.name === "") {
      toast.error("Enter a group name!!");
      return;
    }

    if (info.associatedProject === null || info.associatedProject === "") {
      toast.error("Please select a project to associate it with!!");
      return;
    }
    if (info.members.length < 2) {
      toast.error(
        "A group must containt atleast 3 members including yourself."
      );
      return;
    }
    setNewGroupDetails({
      associatedProject: "",
      groupName: "",
      members: [],
    });
    await dispatch(createConversation(info));
  };

  // Set  up socket.io
  useLayoutEffect(() => {
    if (conversations && user) {
      const convIds = [];
      for (let conv of conversations) {
        convIds.push(conv._id);
      }
      setSocket(
        io(URL as string, {
          auth: {
            token: convIds ? convIds : [],
          },
        })
      );
    }
  }, [conversations, user]);

  // Fetch Conversations and members
  useEffect(() => {
    dispatch(getConversations());
    dispatch(getKnownMembers());

    if (isAuthenticated === false && selfLoading === false) {
      toast.error("Please login to access this page");
      router.push("/");
    }
  }, [isAuthenticated, selfLoading]);

  // Set current chat
  useEffect(() => {
    if (currentChat !== null) {
      var element = document.getElementById("chat-box")!;
      element.scrollTo({
        top: 1000,
        behavior: "smooth",
      });
      // socket.emit("join-room", { roomId: currentChat._id });
    }
  }, [currentChat]);

  // Typing emit
  useEffect(() => {
    if (newMessage !== "" && user) {
      socket.emit("typing", {
        conversationId: currentChat?._id,
        senderName: user?.name,
        senderId: user?._id,
        // sender: { name: user?.name },
      });
    }
  }, [newMessage]);

  // Typing listen
  useEffect(() => {
    if (socket) {
      socket?.on(
        "typing_from_server",
        ({
          senderName,
          conversationId,
          senderId,
        }: {
          senderName: string;
          conversationId: string;
          senderId: string;
        }) => {
          if (user?._id !== senderId) {
            setIsTyping(true);
            setTyperName(senderName);
            sendTyperConversationId(conversationId);
            setTimeout(() => {
              setIsTyping(false);
            }, 2000);
          }
        }
      );
      return () => {
        // before the component is destroyed
        // unbind all event handlers used in this component
        socket?.off("typing_from_server", () => {
          console.log("Not typing");
        });
      };
    }
  }, [socket]);

  // recieve new message

  const [newCurrentChat, setNewCurrentChat] = useState(null);
  useEffect(() => {
    if (newCurrentChat) {
      console.log("newCurrentChat : ", newCurrentChat);
      dispatch(setCurrentChat({ conversation: newCurrentChat }));
      setNewCurrentChat(null);
    }
  }, [newCurrentChat]);
  useEffect(() => {
    if (socket && conversations) {
      socket.on("new_message_recieve", (data) => {
        console.log("Hii");
        const conversations = data.allConversations;
        const currentConversation = data.currentConversation;
        setNewCurrentChat(currentConversation);
        dispatch(setConversation({ conversations: conversations }));
      });
    }
  }, [socket, conversations]);
  // Create a new group
  useEffect(() => {
    if (createConversationSuccess === true) {
      if (createConversationMessage !== "Conversation already initialized.") {
        toast.success(createConversationMessage);
      }
      dispatch(getConversations());
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
          {user && user?.role === CONTENT_CREATOR && (
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

                  <div className="flex items-center gap-4">
                    <Select
                      id="attached-project"
                      onValueChange={(e) => {
                        console.log(e);
                        setNewGroupDetails({
                          ...newGroupDetails,
                          associatedProject: e,
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          className="w-full"
                          placeholder="Choose Related Project"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {user?.jobs?.map((job) => {
                          return (
                            <SelectItem value={job?._id}>
                              {job?.jobTitle}
                            </SelectItem>
                          );
                        })}
                        {/* <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem> */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    {/* <Label htmlFor="members" className="text-right"></Label> */}
                    <Input
                      placeholder="Search Members"
                      id="members"
                      value={newGroupMember}
                      onChange={(e) => {
                        setNewGroupMember(e.target.value);
                      }}
                      className="col-span-3"
                    />
                  </div>
                  <div className="flex w-full flex-col items-center gap-4">
                    {knownMembers && (
                      <ScrollArea
                        className="w-full border min-h-[7rem] max-h-[15rem] border-gray-600 p-2"
                        style={{ borderRadius: "10px" }}
                      >
                        {knownMembers
                          ?.filter((item) => {
                            let itemName = item?.name?.toLowerCase();

                            if (newGroupMember === "") return item;

                            if (
                              newGroupMember.toLowerCase().includes(itemName) ||
                              itemName?.includes(
                                newGroupMember.toLowerCase()
                              ) ||
                              newGroupMember.toLowerCase() ===
                                itemName.toLowerCase()
                            )
                              return item;
                          })
                          ?.map((item) => {
                            return (
                              <div className="w-full h-[4rem]">
                                <div className="h-full  flex justify-between p-2 items-center">
                                  <div className="flex gap-3 items-center ">
                                    <img
                                      className="h-10 w-10"
                                      src={item?.avatar?.url}
                                      alt=""
                                      style={{ borderRadius: "100%" }}
                                    />
                                    {item.name}
                                  </div>
                                  <Button
                                    className="icon h-8 w-8 cursor-pointer"
                                    style={{ borderRadius: "100%" }}
                                    onClick={() => {
                                      // Is it already included in the members list
                                      if (
                                        newGroupDetails?.members?.includes(
                                          item?._id?.toString() as string
                                        )
                                      ) {
                                        let newMembers = [];

                                        // for(let mem of newGroupDetails?.members){
                                        //   if(mem?.toString() !==
                                        //   item?._id.toString())
                                        // }
                                        newMembers =
                                          newGroupDetails?.members?.filter(
                                            (ele) => {
                                              console.log("ele : ", item);
                                              if (
                                                ele?.toString() !==
                                                item?._id.toString()
                                              ) {
                                                return ele;
                                              }
                                            }
                                          );
                                        setNewGroupDetails({
                                          ...newGroupDetails,
                                          members: newMembers,
                                        });
                                      } else {
                                        let newMembers =
                                          newGroupDetails.members;
                                        newMembers.push(item._id);
                                        setNewGroupDetails({
                                          ...newGroupDetails,
                                          members: newMembers,
                                        });
                                      }
                                    }}
                                  >
                                    {newGroupDetails?.members?.includes(
                                      item?._id?.toString() as string
                                    ) ? (
                                      <RemoveIcon className="text-red-600" />
                                    ) : (
                                      <AddIcon className="text-green-700" />
                                    )}
                                  </Button>
                                </div>
                                {/* <Separator /> */}
                              </div>
                            );
                          })}
                      </ScrollArea>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      createGroupHandler();
                    }}
                  >
                    Create group
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <ScrollArea className=" h-full  p-4 flex flex-col gap-2 ">
          {conversations != null &&
            conversations
              ?.filter((item) => {
                if (chatFilter === "") return item;
                let filter = chatFilter.toLowerCase();
                if (item.isGroup === false) {
                  let name = item?.members[0]?.name?.toLowerCase();
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
                          <div className="flex flex-col">
                            {user?._id.toString() ===
                            conversation?.members[1]?._id
                              ? conversation?.members[0]?.name
                              : conversation?.members[1]?.name}

                            {conversation?._id === typerConversationId &&
                              isTyping && (
                                <ThreeDots
                                  visible={true}
                                  height="30"
                                  width="30"
                                  color="green"
                                  radius="1"
                                  ariaLabel="three-dots-loading"
                                  wrapperStyle={{}}
                                  wrapperClass=""
                                />
                              )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <img
                            src="/projectGroup.jpg"
                            alt=""
                            className="h-10 w-10 object-cover"
                            style={{ borderRadius: "10px" }}
                          />
                          <div className="flex flex-col">
                            {conversation?.name}
                            {conversation?._id === typerConversationId &&
                              isTyping && (
                                <ThreeDots
                                  visible={true}
                                  height="30"
                                  width="30"
                                  color="green"
                                  radius="1"
                                  ariaLabel="three-dots-loading"
                                  wrapperStyle={{}}
                                  wrapperClass=""
                                />
                              )}
                          </div>
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
                    src="/projectGroup.jpg"
                    alt=""
                    className="h-14 w-14 object-cover"
                    style={{ borderRadius: "100%" }}
                  />
                  <div>
                    <Label className="text-2xl">{currentChat?.name}</Label>
                    <p className="text-sm">
                      {currentChat._id === typerConversationId &&
                        isTyping &&
                        typerName !== "" &&
                        typerName + " is typing..."}
                    </p>
                  </div>
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
            <div className="w-full h-[calc(100vh-20rem)] flex flex-col gap-3 justify-end ">
              {currentChat?.messages?.map((message) => {
                return (
                  <>
                    {currentChat?.isGroup ? (
                      <div
                        className="w-full flex"
                        style={{
                          justifyContent:
                            message?.senderId?._id.toString() === user?._id
                              ? "flex-end"
                              : "flex-start",
                        }}
                      >
                        <Label
                          className="text-white
                          dark:bg-white
                          bg-slate-700
                          p-3
                          min-h-[3.5rem]
                          max-w-[25rem]
                          // w-full h-full
                          break-words
                         dark:text-black 
                         flex flex-col gap-2
                         "
                          style={{ borderRadius: "10px" }}
                        >
                          <div className="flex items-center gap-2  ">
                            <img
                              className="h-7 w-7 self-start"
                              style={{ borderRadius: "100%" }}
                              src={message?.senderId?.avatar?.url}
                              alt=""
                            />
                            <p className="text-gray-600">
                              {message?.senderId?.name}
                            </p>
                          </div>
                          <p>{message?.body}</p>
                        </Label>
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

              {currentChat &&
                currentChat?._id === typerConversationId &&
                isTyping &&
                (currentChat.isGroup ? (
                  <div
                    className="bg-white w-[10rem] h-[100%] flex justify-center items-center flex-col"
                    style={{ borderRadius: "10px" }}
                  >
                    <em className="text-base text-black">
                      {`${
                        typerName.length >= 7
                          ? typerName.slice(0, 6)
                          : typerName
                      } 
                       is typing...`}
                    </em>
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
                ) : (
                  <div
                    className="bg-white w-[5rem] h-[2rem] flex justify-center items-center"
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
                ))}
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
