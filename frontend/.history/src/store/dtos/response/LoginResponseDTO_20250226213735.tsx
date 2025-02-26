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
  private String firstName;
  private String lastName;
  private String emailId;
  private String profilePicture;
  private String selfDescription;
  private List<Conversation> conversations;
  private List<SocialMediaHandle> socialMediaHandles;
  private List<JobSeekerJobApplication> appliedJobs;
  private List<Work> works;
  private List<JobHistory> jobHistory;
  private UserRole userRole;
  private Long currentJobNoticePeriodDays;
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
