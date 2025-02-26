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
  socialMediaPlatformName: string;
  socialMediaHandleUrl: string;
}

export interface ContentCreatorEmployee {
    userId:string;
    private String firstName:string;
    private String lastName:string;
    private String emailId:string;
    private String profilePicture:string;
    private String selfDescription:string;
    private List<SocialMediaHandle> socialMediaHandles:Array<SocialMediaHandle>;
    private List<Work> works:Array<Work>;
    private List<JobHistory> jobHistory:Array<JobHistory>;
    private UserRole userRole;
    private Long currentSalary;
    private Boolean isServingNoticePeriod;
    private Date noticePeriodEndDate;
}

export interface ContentCreatorJobPost {}

export interface MessageDetail {}

export interface CallLog {}
export interface User {}
