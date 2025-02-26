export interface Conversation {
    conversationId : number,
    members : Array<User> ,
    groupName:string,
    messages =  Array<MessageDetail>;

    @Convert(converter = CallLogConverter.class)
    private List<CallLog> callLogs = new ArrayList<>();
    private Date lastMessage;

    private Boolean isGroupChat=false;
    private Boolean isTeamMemberConversation=false;

    @ManyToOne
    private User admin;
}

export interface SocialMediaHandle {}

export interface ContentCreatorEmployee {}

export interface ContentCreatorJobPost {}
