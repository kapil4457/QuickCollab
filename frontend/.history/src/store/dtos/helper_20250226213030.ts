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

export interface DateRange {
  startDate: Date;
  endDate: Date;
}
export interface CallLog {
  callId: string;
  conversationId: number;
  members: Map<User, DateRange>;
  inCallMembers: number;
  startedAt: Date;
  endedAt: Date;
}
export interface User {}

export interface Work {}
export interface JobHistory {}

export interface JobSeekerJobApplication {
    jobId:number;
    jobName:string;
    private String jobDescription;
    private String jobStatus;
    private Long openingsCount;
    private String jobLocationType;
    private String jobLocation;
    private Long noticePeriodDays;
}
