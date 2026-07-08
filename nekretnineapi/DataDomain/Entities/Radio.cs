using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class Radio
{
    public int Id { get; set; }

    public int IdSurvey { get; set; }

    public string Value { get; set; } = null!;
}
