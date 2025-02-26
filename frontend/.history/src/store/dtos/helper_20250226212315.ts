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
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  profilePicture: string;
  selfDescription: string;
  socialMediaHandles: Array<SocialMediaHandle>;
  works: Array<Work>;
  jobHistory: Array<JobHistory>;
  userRole: string;
  currentSalary: number;
  isServingNoticePeriod: boolean;
  noticePeriodEndDate: Date;
}

export interface ContentCreatorJobPost {
  jobId: number;
  jobName: string;
  jobDescription: string;
  jobStatus: string;
  openingsCount: number;
  jobLocationType: string;
  applicants: Array<ContentCreatorEmployee>;
}

export interface MessageDetail {
  message: string;
  messageType: string;
  author: User;
  sentOn: Date;
}

export interface CallLog {
    callId:string;
    conversationId:number;
    private HashMap<User , Pair<Date,Date>> members= new HashMap<>();
    inCallMembers:number;
    private Date startedAt;
    private Date endedAt;
}
export interface User {}

export interface Work {}
export interface JobHistory {}
