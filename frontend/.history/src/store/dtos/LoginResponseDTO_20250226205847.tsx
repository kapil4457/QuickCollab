interface ContentCreatorUserDetails{
    userId : string,
    firstName : string,
    lastName:string,
    emailId:string,
    profilePicture:string,
    selfDescription:string,
    conversations : Array<Conversation>,
    <SocialMediaHandle> socialMediaHandles: Array<SocialMediaHandle>,
    List<ContentCreatorEmployee> employees,
    List<ContentCreatorJobPost> jobsPosted,
    userRole : string,
    currentJobNoticePeriodDays:number;
}

export interface loginResponseDTO {
  user: null;
  message: string;
  success: boolean;
}
