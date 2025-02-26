interface ContentCreatorUserDetails{
    userId : string,
    firstName : string;
    private String lastName;
    private String emailId;
    private String profilePicture;
    private String selfDescription;
    private List<Conversation> conversations;
    private List<SocialMediaHandle> socialMediaHandles;
    private List<ContentCreatorEmployee> employees;
    private List<ContentCreatorJobPost> jobsPosted;
    private UserRole userRole;
    private Long currentJobNoticePeriodDays;
}

export interface loginResponseDTO {
  user: null;
  message: string;
  success: boolean;
}
