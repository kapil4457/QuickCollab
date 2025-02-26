import {
  ContentCreatorEmployee,
  ContentCreatorJobPost,
  Conversation,
  JobHistory,
  JobSeekerJobApplication,
  OfferDetail,
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
  conversations: Array<Conversation>;
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
  conversations: Array<Conversation>;
  works: Array<Work>;
  appliedJobs: Array<JobSeekerJobApplication>;
  socialMediaHandles: Array<SocialMediaHandle>;
  userRole: string;
  offersReceived: Array<OfferDetail>;
  currentJobNoticePeriodDays: number;
}
export interface TeamMemberUserDetails {
  userId:string;
  firstName:string;
  lastName:string;
  emailId:string;
  profilePicture:string;
  selfDescription:string;
  conversations:Array<Conversation>;
  private List<SocialMediaHandle> socialMediaHandles:Array<SocialMediaHandle>;
  private List<JobSeekerJobApplication> appliedJobs:Array<JobSeekerJobApplication>;
  private List<Work> works:Array<Work>;
  private List<JobHistory> jobHistory:Array<JobHistory>;
  serRole:string;
  private Long currentJobNoticePeriodDays:number;
  private ReportingUser reportsTo;
  private List<OfferDetail> offersReceived;
}

export interface loginResponseDTO {
  user:
    | null
    | ContentCreatorUserDetails
    | JobSeekerUserDetails
    | TeamMemberUserDetails;
  message: string;
  success: boolean;
}
