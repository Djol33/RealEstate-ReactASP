using System;

namespace Application.DTO.Admin
{
    public class ContactMessageAdminListItemDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string ReasonName { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public string ReplyText { get; set; }
        public DateTime? RepliedAt { get; set; }
        public string RepliedByEmail { get; set; }
        public DateTime? ClosedAt { get; set; }
        public bool IsHandled { get; set; }
    }
}
