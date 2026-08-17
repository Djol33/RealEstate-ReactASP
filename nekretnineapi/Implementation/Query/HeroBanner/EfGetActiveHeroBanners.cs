using Application;
using Application.DTO.HeroBanner;
using Application.Query;
using DataDomain.Entities;

namespace Implementation.Query
{
    public class EfGetActiveHeroBanners : IGetActiveHeroBanners
    {
        public int Id => 36;
        public string Name => "Get Active Hero Banners";

        private readonly AppDbContext db;

        public EfGetActiveHeroBanners(AppDbContext db)
        {
            this.db = db;
        }

        public List<HeroBannerActiveItemDTO> Execute(int request)
        {
            var now = DateTime.Now;

            return db.HeroBannerRequests
                .Where(h => h.Status == HeroBannerStatus.Approved && h.StartsAt <= now && h.EndsAt > now)
                .OrderByDescending(h => h.StartsAt)
                .Join(db.Realestates, h => h.RealestateId, r => r.Id, (h, r) => new { h, r })
                .Where(x => x.r.IsActive == 1)
                .Select(x => new HeroBannerActiveItemDTO
                {
                    RealestateId = x.r.Id,
                    Title = x.r.Title,
                    CityName = db.Cities.Where(c => c.Id == x.r.City).Select(c => c.City1).FirstOrDefault() ?? string.Empty,
                    Price = x.r.Price,
                    ImageLocation = x.r.RealestateImages.Select(img => img.Location).FirstOrDefault(),
                    CompanyName = db.Companies.Where(c => c.FkId == x.r.Owner).Select(c => c.Name).FirstOrDefault()
                })
                .ToList();
        }
    }
}
