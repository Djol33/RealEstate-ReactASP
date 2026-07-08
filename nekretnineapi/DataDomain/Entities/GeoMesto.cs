using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;

namespace DataDomain.Entities;

public partial class GeoMesto
{
    public int Id { get; set; }

    public string? Naziv { get; set; }

    public double? Lat { get; set; }

    public double? Lng { get; set; }

    public int? Populacija { get; set; }
    [NotMapped]
    public Point? Lokacija { get; set; }  

}
