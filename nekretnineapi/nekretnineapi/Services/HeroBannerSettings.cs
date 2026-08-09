using Application.HeroBanner;

namespace nekretnineapi.Services
{
    public class HeroBannerSettings : IHeroBannerPricing
    {
        public const string SectionName = "HeroBanner";

        public decimal PricePerDay { get; set; } = 5.00m;
    }
}
