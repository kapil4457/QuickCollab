import {
  ContentCreatorEmployee,
  ContentCreatorJobPost,
  Conversation,
  SocialMediaHandle,
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
  userId:string;
  firstName:string;
  lastName:string;
  emailId:string;
  private String profilePicture;
  private String selfDescription;
  private List<JobHistory> jobHistory;
  private List<Conversation> conversations;
  private List<Work> works;
  private List<JobSeekerJobApplication> appliedJobs;
  private List<SocialMediaHandle> socialMediaHandles;
  private UserRole userRole;
  private List<OfferDetail> offersReceived;
  private Long currentJobNoticePeriodDays;
}
export interface loginResponseDTO {
  user: null | ContentCreatorUserDetails;
  message: string;
  success: boolean;
}
