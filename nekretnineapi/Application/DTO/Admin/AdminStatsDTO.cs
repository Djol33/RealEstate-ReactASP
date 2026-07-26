using Application.DTO;
using System.Collections.Generic;

namespace Application.DTO.Admin
{
    public class AdminStatsDTO
    {
        public int TotalUsers { get; set; }
        public int TotalAdmins { get; set; }
        public int TotalRealEstate { get; set; }
        public int TotalMessages { get; set; }
        public int TotalViews { get; set; }
        public double AvgViewedArea { get; set; }
        public decimal AvgViewedPrice { get; set; }
        public List<CityCountDTO> TopCities { get; set; }
        public List<RealEstateDTO> MostViewed { get; set; }
    }

    public class CityCountDTO
    {
        public string CityName { get; set; }
        public int Count { get; set; }
    }
}
