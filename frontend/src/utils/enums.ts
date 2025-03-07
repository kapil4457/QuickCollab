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
  MANAGER: "MANAGER",
  VIDEO_EDITOR: "VIDEO_EDITOR",
  PHOTO_EDITOR: "PHOTO_EDITOR",
  THUMBNAIL_EDITOR: "THUMBNAIL_EDITOR",
  SCRIPT_WRITER: "SCRIPT_WRITER",
  APPROVER: "APPROVER",
  UPLOADER: "UPLOADER",
});

export const TeamMemberRole = Object.freeze({
  MANAGER: "MANAGER",
  VIDEO_EDITOR: "VIDEO_EDITOR",
  PHOTO_EDITOR: "PHOTO_EDITOR",
  THUMBNAIL_EDITOR: "THUMBNAIL_EDITOR",
  SCRIPT_WRITER: "SCRIPT_WRITER",
  APPROVER: "APPROVER",
  UPLOADER: "UPLOADER",
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
