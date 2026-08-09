using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class Amenity
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public bool IsFilterable { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Realestate> Realestates { get; set; } = new List<Realestate>();
}
