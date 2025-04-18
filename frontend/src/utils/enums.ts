export const MessageType = Object.freeze({
  MESSAGE: "MESSAGE",
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
});

export const OfferStatus = Object.freeze({
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
  REVISION: "REVISION",
  EXPIRED: "EXPIRED",
});
export const AllRoles = Object.freeze({
  CONTENT_CREATOR: "CONTENT_CREATOR",
  JOB_SEEKER: "JOB_SEEKER",
  TEAM_MEMBER: "TEAM_MEMBER",
});

export const TeamMemberRole = Object.freeze({
  TEAM_MEMBER: "TEAM_MEMBER",
});

export const RegistrationRole = Object.freeze({
  CONTENT_CREATOR: "CONTENT_CREATOR",
  JOB_SEEKER: "JOB_SEEKER",
});

export const JobLocationType = Object.freeze({
  REMOTE: "REMOTE",
  HYBRID: "HYBRID",
  ONSITE: "ONSITE",
});
export const JobStatus = Object.freeze({
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  INACTIVE: "INACTIVE",
  FILLED: "FILLED",
});
export const CreateJobStatus = Object.freeze({
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
});

export const RegisterationMethod = Object.freeze({
  FACEBOOK_LOGIN: "FACEBOOK_LOGIN",
  GOOGLE_LOGIN: "GOOGLE_LOGIN",
  TWITTER_LOGIN: "TWITTER_LOGIN",
  CREDENTIALS_LOGIN: "CREDENTIALS_LOGIN",
});

export const ContentType = Object.freeze({
  REEL: "REEL",
  VIDEO: "VIDEO",
  MESSAGE_POST: "MESSAGE_POST",
});

export const PlatformType = Object.freeze({
  INSTAGRAM: "INSTAGRAM",
  FACEBOOK: "FACEBOOK",
  YOUTUBE: "YOUTUBE",
  TWITTER: "TWITTER",
});

export const SocialMediaHandleType = Object.freeze({
  INSTAGRAM: "INSTAGRAM",
  FACEBOOK: "FACEBOOK",
  YOUTUBE: "YOUTUBE",
  TWITTER: "TWITTER",
});

export const MediaType = Object.freeze({
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
});

export const ProviderName = Object.freeze({
  YOUTUBE: "YOUTUBE",
  INSTAGRAM: "INSTAGRAM",
  TWITTER: "TWITTER",
  FACEBOOK: "FACEBOOK",
});

export const UploadRequestStatus = Object.freeze({
  PENDING: "PENDING",
  REVISION: "REVISION",
  APPROVED: "APPROVED",
  DECLINED: "DECLINED",
  UPLOAD_IN_PROGRESS: "UPLOAD_IN_PROGRESS",
  UPLOAD_COMPLETED: "UPLOAD_COMPLETED",
  UPLOAD_FAILED: "UPLOAD_FAILED",
});
