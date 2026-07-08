using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class User
{
    public int Id { get; set; }

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int UserType { get; set; }

    public int UserRole { get; set; }

    public DateTime CreatedAt { get; set; }

    public short IsActive { get; set; }

    public virtual ICollection<Company> Companies { get; set; } = new List<Company>();

    public virtual ICollection<UserBasic> UserBasics { get; set; } = new List<UserBasic>();
}
