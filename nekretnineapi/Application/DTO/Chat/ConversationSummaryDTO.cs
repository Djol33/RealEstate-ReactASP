using System;

namespace Application.DTO.Chat
{
    public class ConversationSummaryDTO
    {
        public int OtherUserId { get; set; }
        public string OtherUserName { get; set; }
        public string LastMessage { get; set; }
        public DateTime LastAt { get; set; }
        public int UnreadCount { get; set; }
    }
}
