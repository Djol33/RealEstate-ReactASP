using System;

namespace Application.DTO.Chat
{
    public class MessageDTO
    {
        public long Id { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Content { get; set; }
        public DateTime SentAt { get; set; }
        public bool IsRead { get; set; }
    }
}
