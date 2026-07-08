using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class Header
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string HrefLink { get; set; } = null!;

    public int? ParendId { get; set; }

    public short? Logged { get; set; }

    public int? Role { get; set; }
}
