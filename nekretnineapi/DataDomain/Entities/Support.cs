using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class Support
{
    public int Id { get; set; }

    public int? IdUser { get; set; }

    public string? FName { get; set; }

    public string? LName { get; set; }

    public string? Email { get; set; }

    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public DateTime DateReported { get; set; }

    public int IsRead { get; set; }

    public int? ReasonId { get; set; }

    public string? ReplyText { get; set; }

    public DateTime? RepliedAt { get; set; }

    public int? RepliedBy { get; set; }

    public DateTime? ClosedAt { get; set; }

    public virtual ContactReason? ReasonNavigation { get; set; }
}
