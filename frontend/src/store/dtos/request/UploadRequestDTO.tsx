export interface UploadRequestDTO {
  title: string;
  description: string;
  tags: Array<string>;
  uploadTo: Array<string>;
  uploadRequestStatus: string;
  media: File | null;
  uploadTypeMapping: UploadRequestItem[] | null;
  mediaType: string | null;
  mediaUrl: string;
}

export interface UploadRequestItem {
  platform: string;
  contentType: string;
  status: string;
}
