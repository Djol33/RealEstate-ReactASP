using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class HeatingRealestate
{
    public long IdRealestate { get; set; }

    public int IdHeating { get; set; }

    public virtual HeatingType IdHeatingNavigation { get; set; } = null!;

    public virtual Realestate IdRealestateNavigation { get; set; } = null!;
}
