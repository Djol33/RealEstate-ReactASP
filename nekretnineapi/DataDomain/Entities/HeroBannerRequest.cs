using System;

namespace DataDomain.Entities;

public partial class HeroBannerRequest
{
    public int Id { get; set; }

    public long RealestateId { get; set; }

    public int RequestedBy { get; set; }

    public int Days { get; set; }

    public decimal PricePerDay { get; set; }

    public decimal TotalPrice { get; set; }

    public int Status { get; set; }

    public DateTime? StartsAt { get; set; }

    public DateTime? EndsAt { get; set; }

    public DateTime CreatedAt { get; set; }
}
