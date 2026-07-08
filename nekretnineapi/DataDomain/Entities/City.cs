using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class City
{
    public int Id { get; set; }

    public string City1 { get; set; } = null!;

    public int Zip { get; set; }

    public string Opstina { get; set; } = null!;

    public decimal? Lat { get; set; }

    public decimal? Lng { get; set; }
}
