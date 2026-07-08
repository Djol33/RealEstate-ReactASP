using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class Text
{
    public int Id { get; set; }

    public string Value { get; set; } = null!;
}
