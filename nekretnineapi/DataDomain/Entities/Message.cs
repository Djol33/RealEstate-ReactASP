using System;

namespace DataDomain.Entities;

public partial class Message
{
    public long Id { get; set; }

    public int SenderId { get; set; }

    public int ReceiverId { get; set; }

    public string Content { get; set; } = null!;

    public DateTime SentAt { get; set; }

    public bool IsRead { get; set; }
}
