import {
  ContentCreatorEmployee,
  ContentCreatorJobPost,
  JobHistory,
  JobSeekerJobApplication,
  OfferDetail,
  PersonalProject,
  ReportingUser,
  SocialMediaHandle,
} from "../helper";
import { UploadRequestItem } from "../request/UploadRequestDTO";

export interface ContentCreatorUserDetails {
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  profilePicture: string;
  selfDescription: string;
  socialMediaHandles: Array<SocialMediaHandle>;
  employees: Array<ContentCreatorEmployee>;
  jobsPosted: Array<ContentCreatorJobPost>;
  userRole: string;
  currentJobNoticePeriodDays: number;
  providers: Array<ProviderDTO>;
  uploadRequests: Array<UploadRequestResponseDTO>;
}
export interface UploadRequestResponseDTO {
  requestId: number;
  title: string;
  description: string;
  tags: Array<string>;
  uploadTo: Array<string>;
  uploadRequestStatus: string;
  mediaUrl: string;
  uploadTypeMapping: UploadRequestItem[];
  mediaType: string;
  requestedBy: ReportingUser;
}
export interface ProviderDTO {
  providerName: string;
}
export interface JobSeekerUserDetails {
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  profilePicture: string;
  selfDescription: string;
  jobHistory: Array<JobHistory>;
  personalProjects: Array<PersonalProject>;
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
  socialMediaHandles: Array<SocialMediaHandle>;
  appliedJobs: Array<JobSeekerJobApplication>;
  personalProjects: Array<PersonalProject>;
  jobHistory: Array<JobHistory>;
  userRole: string;
  currentJobNoticePeriodDays: number;
  reportsTo: ReportingUser;
  currentJobDetails: JobHistory;
  currentSalary: number;
  offersReceived: Array<OfferDetail>;
  noticePeriodEndDate: Date;
  currentJobJoinedOn: Date;
  isServingNoticePeriod: boolean;
  availablePlatforms: Array<string>;
  availableContentTypes: UploadRequestItemList[];
  uploadRequests: Array<UploadRequestResponseDTO>;
}

export interface UploadRequestItemList {
  platform: string;
  contentTypes: string[];
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
