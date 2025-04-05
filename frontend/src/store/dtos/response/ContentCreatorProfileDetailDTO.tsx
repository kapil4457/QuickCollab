import { ContentCreatorJobPost, SocialMediaHandle } from "../helper";

export interface ContentCreatorProfileDetailDTO {
  userId: string;
  firstName: string;
  lastName: string;
  userRole: string;
  profilePicture: string;
  selfDescription: string;
  socialMediaHandles: Array<SocialMediaHandle>;
  employeeCount: number;
  jobsPosted: Array<ContentCreatorJobPost>;
}
