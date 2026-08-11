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
            var requests = db.HeroBannerRequests
                .OrderByDescending(h => h.CreatedAt)
                .ToList();

            var realestateIds = requests.Select(h => h.RealestateId).Distinct().ToList();
            var userIds = requests.Select(h => h.RequestedBy).Distinct().ToList();

            var titlesById = db.Realestates
                .Where(r => realestateIds.Contains(r.Id))
                .Select(r => new { r.Id, r.Title })
                .ToDictionary(x => x.Id, x => x.Title);

            var companyNamesByUserId = db.Companies
                .Where(c => userIds.Contains(c.FkId))
                .Select(c => new { c.FkId, c.Name })
                .ToDictionary(x => x.FkId, x => x.Name);

            var emailsByUserId = db.Users
                .Where(u => userIds.Contains(u.Id))
                .Select(u => new { u.Id, u.Email })
                .ToDictionary(x => x.Id, x => x.Email);

            return requests.Select(h => new HeroBannerAdminListItemDTO
            {
                Id = h.Id,
                RealestateId = h.RealestateId,
                RealestateTitle = titlesById.GetValueOrDefault(h.RealestateId),
                CompanyName = companyNamesByUserId.GetValueOrDefault(h.RequestedBy),
                RequestedByEmail = emailsByUserId.GetValueOrDefault(h.RequestedBy),
                Days = h.Days,
                PricePerDay = h.PricePerDay,
                TotalPrice = h.TotalPrice,
                Status = h.Status,
                StartsAt = h.StartsAt,
                EndsAt = h.EndsAt,
                CreatedAt = h.CreatedAt,
                RevokedAt = h.RevokedAt
            }).ToList();
        }
    }
}
