using System;

namespace DataDomain.Entities;

public partial class RealestateReport
{
    public int Id { get; set; }

    public long RealestateId { get; set; }

    public int ReportedBy { get; set; }

    public string Reason { get; set; } = null!;

    public string? Details { get; set; }

    public int Status { get; set; }

    public DateTime CreatedAt { get; set; }
}
