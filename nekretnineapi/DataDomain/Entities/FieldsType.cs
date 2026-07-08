using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class FieldsType
{
    public int Id { get; set; }

    public string Type { get; set; } = null!;

    public virtual ICollection<Survey> Surveys { get; set; } = new List<Survey>();
}
