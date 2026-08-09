using Application.DTO.HeroBanner;
using Application.Query.Admin;
using DataDomain.Entities;

namespace Implementation.Query.Admin
{
    public class EfAdminListHeroBannerRequests : IAdminListHeroBannerRequests
    {
        public int Id => 34;
        public string Name => "Admin List Hero Banner Requests";

        private readonly AppDbContext db;

        public EfAdminListHeroBannerRequests(AppDbContext db)
        {
            this.db = db;
        }

        public List<HeroBannerAdminListItemDTO> Execute(int request)
        {
            return db.HeroBannerRequests
                .OrderByDescending(h => h.CreatedAt)
                .Select(h => new HeroBannerAdminListItemDTO
                {
                    Id = h.Id,
                    RealestateId = h.RealestateId,
                    RealestateTitle = db.Realestates.Where(r => r.Id == h.RealestateId).Select(r => r.Title).FirstOrDefault(),
                    CompanyName = db.Companies.Where(c => c.FkId == h.RequestedBy).Select(c => c.Name).FirstOrDefault(),
                    RequestedByEmail = db.Users.Where(u => u.Id == h.RequestedBy).Select(u => u.Email).FirstOrDefault(),
                    Days = h.Days,
                    PricePerDay = h.PricePerDay,
                    TotalPrice = h.TotalPrice,
                    Status = h.Status,
                    StartsAt = h.StartsAt,
                    EndsAt = h.EndsAt,
                    CreatedAt = h.CreatedAt
                })
                .ToList();
        }
    }
}
