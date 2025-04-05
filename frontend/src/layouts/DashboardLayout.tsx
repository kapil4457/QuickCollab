import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SideBar } from "../pages/Dashboard/components/SideBar";
import RootLayout from "./RootLayout";
import { useEffect } from "react";
import { getAllConversations } from "@/store/controllers/ConversationController";
import { useAppDispatch } from "@/store/hooks";
import { Client, IFrame } from "@stomp/stompjs";
import { Conversation } from "@/store/dtos/helper";
import { updateLocalConversationByConversationId } from "@/store/slices/conversationSlice";
import { AUTHORIZATION_TOKEN } from "@/constants/AppConstants";
import Footer from "@/components/footer/Footer";

export default function DashboardLayout({
  children,
  extendedClassName = "",
}: {
  children: React.ReactNode;
  extendedClassName?: string;
}) {
  const dispatch = useAppDispatch();
  const jwtToken = localStorage.getItem(AUTHORIZATION_TOKEN) || "";
  let rooms: number[] = [];
  let stompClient: Client;

  const onConnected = () => {
    // Subscribe to multiple rooms
    rooms.forEach((roomId: number) => {
      let endpoint = `/room/sendMessage/${roomId}`;
      stompClient.subscribe(endpoint, (message) => {
        const receivedMessage = JSON.parse(message.body);
        dispatch(
          updateLocalConversationByConversationId({
            conversationId: roomId,
            messageDetail: receivedMessage,
            lastMessage: new Date().toISOString(),
          })
        );
      });

      console.log("subscribe to online and offline events");

      stompClient.subscribe(
        `/room/conversations/online/${roomId}`,
        (message) => {
          // subscribe to online and offline events
          console.log("online : ", message);
        }
      );
    });
  };

  const onError = async (frame: IFrame) => {
    console.error("Broker reported error: " + frame.headers["message"]);
    console.error("Additional details: " + frame.body);
  };
  const fetchAllConversations = async () => {
    const { conversations } = await getAllConversations(dispatch);
    rooms = conversations?.map(
      (conversation: Conversation) => conversation.conversationId
    );
    const base_url = import.meta.env.VITE_BACKEND_SOCKET_URL;

    const socket = new WebSocket(`ws://${base_url}/api/chat?token=${jwtToken}`);
    stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: jwtToken,
      },
    });
    stompClient.onConnect = onConnected;
    stompClient.onStompError = (frame) => onError(frame);
    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  };
  useEffect(() => {
    fetchAllConversations();
  }, []);
  return (
    <RootLayout>
      <SidebarProvider>
        <SideBar />
        <SidebarInset>
          <SidebarTrigger className="absolute top-0 left-0" />
          <div className={`p-10 min-h-[100vh] ${extendedClassName}`}>
            {children}
          </div>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </RootLayout>
  );
}
