export interface MessageRequestDTO {
  message: string | File;
  description: string;
  messageType: string;
  conversationId: number;
  isUploadRequest: boolean;
  uploadTo: Array<string>;
  uploadTypeMapping: Map<string, string>;
}
