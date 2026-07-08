using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class RealestateImage
{
    public long Id { get; set; }

    public string Location { get; set; } = null!;

    public long IdPost { get; set; }

    public string Alt { get; set; } = null!;

    public virtual Realestate IdPostNavigation { get; set; } = null!;
}
