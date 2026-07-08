using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class Company
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Bip { get; set; } = null!;

    public string Location { get; set; } = null!;

    public string Logo { get; set; } = null!;

    public int FkId { get; set; }

    public virtual User Fk { get; set; } = null!;
}
