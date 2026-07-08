using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class Wishlist
{
    public long UserId { get; set; }

    public long RealestateId { get; set; }

    public byte[] IsActive { get; set; } = null!;

    public virtual Realestate Realestate { get; set; } = null!;
}
