interface ContentCreatorUserDetails{
    userId : string,
    firstName : string,
     String lastName:string,
     String emailId:string,
     String profilePicture:string,
     String selfDescription:string,
     List<Conversation> conversations;
     <SocialMediaHandle> socialMediaHandles;
     List<ContentCreatorEmployee> employees;
     List<ContentCreatorJobPost> jobsPosted;
     UserRole userRole : string;
     Long currentJobNoticePeriodDays;
}

export interface loginResponseDTO {
  user: null;
  message: string;
  success: boolean;
}
