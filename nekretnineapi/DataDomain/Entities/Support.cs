using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class Support
{
    public int Id { get; set; }

    public int? IdUser { get; set; }

    public string? FName { get; set; }

    public string? LName { get; set; }

    public string? Email { get; set; }

    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public DateTime DateReported { get; set; }

    public int IsRead { get; set; }
}
