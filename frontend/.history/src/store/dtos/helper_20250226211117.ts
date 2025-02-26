export interface Conversation {
    conversationId : number,
    members : Array<User> ,
    groupName:string,
    messages :  Array<MessageDetail>,
    private List<CallLog> callLogs = new ArrayList<>();
    lastMessage:Date;

    private Boolean isGroupChat=false;
    private Boolean isTeamMemberConversation=false;

    @ManyToOne
    private User admin;
}

export interface SocialMediaHandle {}

export interface ContentCreatorEmployee {}

export interface ContentCreatorJobPost {}
