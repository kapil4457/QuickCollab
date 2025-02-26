package com.quickcollab.pojo;
import com.quickcollab.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.HashMap;

@Getter
@AllArgsConstructor
@Setter
@NoArgsConstructor
public class CallLog {
    private String callId;
    private Long conversationId;
    private HashMap<User , Pair<Date,Date>> members= new HashMap<>();
    private Long inCallMembers;
    private Date startedAt;
    private Date endedAt;
}
