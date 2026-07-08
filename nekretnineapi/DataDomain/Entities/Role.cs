using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class Role
{
    public short Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<User1> User1s { get; set; } = new List<User1>();
}
