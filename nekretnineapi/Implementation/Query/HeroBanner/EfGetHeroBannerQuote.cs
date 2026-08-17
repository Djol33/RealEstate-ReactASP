using Application.DTO.HeroBanner;
using Application.HeroBanner;
using Application.Query;

namespace Implementation.Query
{
    public class EfGetHeroBannerQuote : IGetHeroBannerQuote
    {
        public int Id => 32;
        public string Name => "Get Hero Banner Quote";

        private readonly IHeroBannerPricing pricing;

        public EfGetHeroBannerQuote(IHeroBannerPricing pricing)
        {
            this.pricing = pricing;
        }

        public HeroBannerQuoteDTO Execute(int request)
        {
            return new HeroBannerQuoteDTO { PricePerDay = pricing.PricePerDay };
        }
    }
}
