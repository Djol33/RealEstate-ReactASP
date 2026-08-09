using System;

namespace DataDomain.Entities;

public partial class RealestateView
{
    public long Id { get; set; }

    public string ViewerKey { get; set; } = null!;

    public long RealestateId { get; set; }

    public DateTime ViewedAt { get; set; }

    public int? DurationSeconds { get; set; }
}
