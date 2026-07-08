using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class UserBasic
{
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public int FkId { get; set; }

    public virtual User Fk { get; set; } = null!;
}
