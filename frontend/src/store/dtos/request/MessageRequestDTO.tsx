export interface MessageRequestDTO {
  message: string | File;
  messageType: string;
  conversationId: number;
  isUploadRequest: boolean;
  uploadTo: Array<string>;
  uploadTypeMapping: Map<string, string>;
}
