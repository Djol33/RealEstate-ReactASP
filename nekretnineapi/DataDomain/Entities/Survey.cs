using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class Survey
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string Question { get; set; } = null!;

    public short IsActive { get; set; }

    public int FieldId { get; set; }

    public virtual FieldsType Field { get; set; } = null!;
}
