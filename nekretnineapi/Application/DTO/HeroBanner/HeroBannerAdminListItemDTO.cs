using System;

namespace Application.DTO.HeroBanner
{
    public class HeroBannerAdminListItemDTO
    {
        public int Id { get; set; }
        public long RealestateId { get; set; }
        public string RealestateTitle { get; set; }
        public string CompanyName { get; set; }
        public string RequestedByEmail { get; set; }
        public int Days { get; set; }
        public decimal PricePerDay { get; set; }
        public decimal TotalPrice { get; set; }
        public int Status { get; set; }
        public DateTime? StartsAt { get; set; }
        public DateTime? EndsAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
