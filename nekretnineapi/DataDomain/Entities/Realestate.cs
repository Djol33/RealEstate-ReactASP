using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class Realestate
{
    public long Id { get; set; }

    public string Title { get; set; } = null!;

    public int City { get; set; }

    public string Adress { get; set; } = null!;

    public short TypeObject { get; set; }

    public float NumberOfRooms { get; set; }

    public bool Terrace { get; set; }

    public float Area { get; set; }

    public decimal Price { get; set; }

    public string Description { get; set; } = null!;

    public int IsActive { get; set; }

    public int Owner { get; set; }

    public decimal? Lat { get; set; }

    public decimal? Lng { get; set; }

    public virtual ICollection<RealestateImage> RealestateImages { get; set; } = new List<RealestateImage>();

    public virtual TipObjektum TypeObjectNavigation { get; set; } = null!;

    public virtual ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
}
