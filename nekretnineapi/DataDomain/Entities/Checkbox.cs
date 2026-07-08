using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class Checkbox
{
    public int Id { get; set; }

    public int IdSurvey { get; set; }

    public string Value { get; set; } = null!;
}
