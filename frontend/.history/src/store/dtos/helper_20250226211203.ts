export interface Conversation {
    conversationId : number,
    members : Array<User> ,
    groupName:string,
    messages :  Array<MessageDetail>,
    callLogs :  Array<CallLog>,
    lastMessage:Date,
    isGroupChat:boolean;
    isTeamMemberConversation:boolean;

    @ManyToOne
    private User admin;
}

export interface SocialMediaHandle {}

export interface ContentCreatorEmployee {}

export interface ContentCreatorJobPost {}
