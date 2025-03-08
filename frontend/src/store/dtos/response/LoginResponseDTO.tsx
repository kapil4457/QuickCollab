import {
  ContentCreatorEmployee,
  ContentCreatorJobPost,
  Conversation,
  JobHistory,
  JobSeekerJobApplication,
  OfferDetail,
  ReportingUser,
  SocialMediaHandle,
  Work,
} from "../helper";

export interface ContentCreatorUserDetails {
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  profilePicture: string;
  selfDescription: string;
  // conversations: Array<Conversation>;
  socialMediaHandles: Array<SocialMediaHandle>;
  employees: Array<ContentCreatorEmployee>;
  jobsPosted: Array<ContentCreatorJobPost>;
  userRole: string;
  currentJobNoticePeriodDays: number;
}

export interface JobSeekerUserDetails {
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  profilePicture: string;
  selfDescription: string;
  jobHistory: Array<JobHistory>;
  // conversations: Array<Conversation>;
  works: Array<Work>;
  appliedJobs: Array<JobSeekerJobApplication>;
  socialMediaHandles: Array<SocialMediaHandle>;
  userRole: string;
  offersReceived: Array<OfferDetail>;
  currentJobNoticePeriodDays: number;
}
export interface TeamMemberUserDetails {
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  profilePicture: string;
  selfDescription: string;
  // conversations: Array<Conversation>;
  socialMediaHandles: Array<SocialMediaHandle>;
  appliedJobs: Array<JobSeekerJobApplication>;
  works: Array<Work>;
  jobHistory: Array<JobHistory>;
  userRole: string;
  currentJobNoticePeriodDays: number;
  reportsTo: ReportingUser;
  offersReceived: Array<OfferDetail>;
}
export type loggedInUser =
  | null
  | ContentCreatorUserDetails
  | JobSeekerUserDetails
  | TeamMemberUserDetails;

export interface loginResponseDTO {
  user: loggedInUser;
  message: string;
  success: boolean;
}
