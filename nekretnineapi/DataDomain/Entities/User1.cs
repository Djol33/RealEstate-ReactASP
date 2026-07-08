using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class User1
{
    public long UserId { get; set; }

    public string FName { get; set; } = null!;

    public string LName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public short Role { get; set; }

    public short IsActive { get; set; }

    public virtual Role RoleNavigation { get; set; } = null!;
}
