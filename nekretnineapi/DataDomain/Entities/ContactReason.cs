using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class ContactReason
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public bool IsActive { get; set; } = true;

    public virtual ICollection<Support> Supports { get; set; } = new List<Support>();
}
