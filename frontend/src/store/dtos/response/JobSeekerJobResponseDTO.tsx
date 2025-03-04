export interface ContentCreatorUserDetails {
  jobs: Array<JobSeekerJobDetailDTO>;
  message: string;
  success: boolean;
}

export interface JobSeekerJobDetailDTO {
  jobId: number;
  jobName: string;
  jobDescription: string;
  openingsCount: number;
  jobLocationType: string;
  jobLocation: string;
  postedBy: JobDetailPostedByUserDTO;
  postedOn: Date;
  jobStatus: string;
}

export interface JobDetailPostedByUserDTO {
  userId: string;
  firstName: string;
  lastName: string;
}
