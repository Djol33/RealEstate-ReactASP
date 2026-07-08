using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class TipObjektum
{
    public short Id { get; set; }

    public string Naziv { get; set; } = null!;

    public virtual ICollection<Realestate> Realestates { get; set; } = new List<Realestate>();
}
