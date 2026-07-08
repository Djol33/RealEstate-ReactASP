using System;
using System.Collections.Generic;
using System.Formats.Asn1;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO
{
    public class RealEstateDTO
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string TypeObjectName { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string CityName { get; set; }
        public int CityId { get; set; }
        public bool Terrace { get; set; }
        public float Area { get; set; }
        public string Adress { get; set; }
        public List<Images> Images { get; set; }
        public float NumberOfRooms { get; set; }
        public int? TypeObject { get; set; }
        public bool CanEdit { get; set; }
        public decimal? Lat { get; set; }
        public decimal? Lng { get; set; }
    }

    public class Images
    {
        public long Id { get; set; }
        public string Location { get; set; }

    }
}
