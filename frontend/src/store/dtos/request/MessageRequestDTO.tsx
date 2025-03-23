export interface MessageRequestDTO {
  message: string;
  media: File | null;
  description: string;
  messageType: string;
  conversationId: number;
}
