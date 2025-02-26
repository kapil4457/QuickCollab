export interface Conversation {
  conversationId: number;
  members: Array<User>;
  groupName: string;
  messages: Array<MessageDetail>;
  callLogs: Array<CallLog>;
  lastMessage: Date;
  isGroupChat: boolean;
  isTeamMemberConversation: boolean;
  admin: User;
}

export interface SocialMediaHandle {
    socialMediaPlatformName:strin;
    private String socialMediaHandleUrl;
}

export interface ContentCreatorEmployee {}

export interface ContentCreatorJobPost {}

export interface MessageDetail {}

export interface CallLog {}
export interface User {}
