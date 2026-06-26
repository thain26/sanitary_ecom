package com.sanitary.ecommerce.ai;

import java.util.List;

public class ChatResponse {
    private String reply;
    private List<String> suggestedSlugs;

    public ChatResponse(String reply, List<String> suggestedSlugs) {
        this.reply = reply;
        this.suggestedSlugs = suggestedSlugs;
    }

    public String getReply() { return reply; }
    public List<String> getSuggestedSlugs() { return suggestedSlugs; }
}
