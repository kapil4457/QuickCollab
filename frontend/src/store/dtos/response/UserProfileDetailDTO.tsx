import {
  ContentCreatorJobPost,
  PersonalProject,
  ReportingUser,
  SocialMediaHandle,
  UserProfileJobHistoryDTO,
} from "../helper";

export interface UserProfileDetailDTO {
  userId: string;
  firstName: string;
  lastName: string;
  userRole: string;
  profilePicture: string;
  selfDescription: string;
  socialMediaHandles: Array<SocialMediaHandle>;
  employeeCount: number;
  jobsPosted: Array<ContentCreatorJobPost>;
  personalProjects: Array<PersonalProject>;
  jobHistory: Array<UserProfileJobHistoryDTO>;
  noticePeriodEndDate: Date;
  isServingNoticePeriod: boolean;
  currentJobDetails: UserProfileJobHistoryDTO;
  currentJobNoticePeriodDays: number;
  reportsTo: ReportingUser;
}
