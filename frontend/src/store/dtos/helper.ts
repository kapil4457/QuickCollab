import { ExternalLink, MediaFile } from "./request/projectDetailsRequestDTO";

export interface Conversation {
  conversationId: number;
  members: Array<ConversationUser>;
  groupName: string;
  messages: Array<MessageDetail>;
  callLogs: Array<CallLog>;
  lastMessage: string;
  isGroupChat: boolean;
  isTeamMemberConversation: boolean;
  admin: ConversationUser;
}

export interface SocialMediaHandle {
  socialMediaPlatformName: string;
  socialMediaHandleUrl: string;
}

export interface ConversationUser {
  userId: string;
  firstName: string;
  lastName: string;
}

export interface ContentCreatorEmployee {
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  profilePicture: string;
  selfDescription: string;
  socialMediaHandles: Array<SocialMediaHandle>;
  personalProjects: Array<PersonalProject>;
  jobHistory: Array<JobHistory>;
  userRole: string;
  currentSalary: number;
  isServingNoticePeriod: boolean;
  noticePeriodEndDate: Date;
}

export interface PersonalProject {
  title: string;
  projectId: number;
  description: string;
  mediaFiles: Array<MediaFile>;
  externalLinks: Array<ExternalLink>;
}

export interface ContentCreatorJobPost {
  jobId: number;
  jobName: string;
  jobDescription: string;
  jobStatus: string;
  openingsCount: number;
  jobLocationType: string;
  jobLocation: string;
  applicants: Array<ContentCreatorEmployee>;
  offeredTo: Array<OfferDetail>;
  postedOn: Date;
  noticePeriodDays: number;
}

export interface MessageDetail {
  message: string;
  fileUrl: string;
  description: string;
  messageType: string;
  author: ConversationUser;
  sentOn: string;
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

export interface JobHistory {
  jobId: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  userRole: string;
  location: string;
  salary: number;
  locationType: string;
}

export interface ReportingUser {
  userId: string;
  firstName: string;
  lastName: string;
}

export interface JobSeekerJobApplication {
  jobId: number;
  jobName: string;
  jobDescription: string;
  jobStatus: string;
  openingsCount: number;
  jobLocationType: string;
  jobLocation: string;
  noticePeriodDays: number;
}

export interface OfferDetail {
  offerId: string;
  userId: string;
  jobId: number;
  jobTitle: string;
  salary: number;
  userRole: string;
  offeredOn: Date;
  validTill: Date;
  offerStatus: string;
}
