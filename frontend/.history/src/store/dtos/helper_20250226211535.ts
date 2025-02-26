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
    private String profilePicture;
    private String selfDescription;
    private List<SocialMediaHandle> socialMediaHandles;
    private List<Work> works;
    private List<JobHistory> jobHistory;
    private UserRole userRole;
    private Long currentSalary;
    private Boolean isServingNoticePeriod;
    private Date noticePeriodEndDate;
}

export interface ContentCreatorJobPost {}

export interface MessageDetail {}

export interface CallLog {}
export interface User {}
