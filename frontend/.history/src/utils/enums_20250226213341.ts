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

export const UserRole = Object.freeze({
  CONTENT_CREATOR: "CONTENT_CREATOR",
  MANAGER: "MANAGER",
  JOB_SEEKER: "JOB_SEEKER",
  VIDEO_EDITOR,
  PHOTO_EDITOR,
  THUMBNAIL_EDITOR,
  SCRIPT_WRITER,
  APPROVER,
  UPLOADER,
});
