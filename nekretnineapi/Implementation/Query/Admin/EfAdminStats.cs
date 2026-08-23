using Application;
using Application.DTO;
using Application.DTO.Admin;
using Application.Query.Admin;
using DataDomain.Entities;
using Implementation.Query.Recommendations;
using Microsoft.EntityFrameworkCore;

namespace Implementation.Query.Admin
{
    public class EfAdminStats : IAdminStats
    {
        public int Id => 27;
        public string Name => "Admin Stats";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfAdminStats(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public AdminStatsDTO Execute(int request)
        {
            var topCities = db.Realestates
                .Where(r => r.IsActive == 1)
                .GroupBy(r => r.City)
                .Select(g => new { CityId = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Take(5)
                .ToList()
                .Select(x => new CityCountDTO
                {
                    CityName = db.Cities.Where(c => c.Id == x.CityId).Select(c => c.City1).FirstOrDefault() ?? "Nepoznato",
                    Count = x.Count
                })
                .ToList();

            var mostViewedIds = db.RealestateViews
                .Where(v => db.Realestates.Any(r => r.Id == v.RealestateId && r.IsActive == 1))
                .GroupBy(v => v.RealestateId)
                .Select(g => new { Id = g.Key, Views = g.Count() })
                .OrderByDescending(x => x.Views)
                .Take(5)
                .Select(x => x.Id)
                .ToList();

            var mostViewed = db.Realestates
                .Where(r => mostViewedIds.Contains(r.Id) && r.IsActive == 1)
                .Include(r => r.RealestateImages)
                .Include(r => r.Wishlists)
                .ToList()
                .OrderBy(r => mostViewedIds.IndexOf(r.Id))
                .Select(r => RealEstateMapping.Map(db, actor, r))
                .ToList();

            var viewedStats = db.RealestateViews
                .Join(db.Realestates.Where(r => r.IsActive == 1), v => v.RealestateId, r => r.Id, (v, r) => new { r.Area, r.Price })
                .ToList();

            double avgArea = viewedStats.Count > 0 ? viewedStats.Average(x => x.Area) : 0;
            decimal avgPrice = viewedStats.Count > 0 ? viewedStats.Average(x => x.Price) : 0;

            var now = DateTime.Now;
            var soldQuery = db.Realestates.Where(r => r.IsActive == 1 && r.Status == RealEstateStatus.Sold);

            return new AdminStatsDTO
            {
                SoldLast24h = soldQuery.Count(r => r.SoldAt != null && r.SoldAt >= now.AddDays(-1)),
                SoldLast7Days = soldQuery.Count(r => r.SoldAt != null && r.SoldAt >= now.AddDays(-7)),
                SoldLast30Days = soldQuery.Count(r => r.SoldAt != null && r.SoldAt >= now.AddDays(-30)),
                SoldTotal = soldQuery.Count(),
                TotalUsers = db.Users.Count(u => u.IsActive == 1),
                TotalAdmins = db.Users.Count(u => u.UserRole == UserRoles.Admin && u.IsActive == 1),
                TotalRealEstate = db.Realestates.Count(r => r.IsActive == 1 && r.Status != RealEstateStatus.Sold),
                TotalMessages = db.Messages.Count(m =>
                    db.Users.Any(u => u.Id == m.SenderId && u.IsActive == 1) &&
                    db.Users.Any(u => u.Id == m.ReceiverId && u.IsActive == 1)),
                TotalViews = db.RealestateViews.Count(v =>
                    db.Realestates.Any(r => r.Id == v.RealestateId && r.IsActive == 1)),
                AvgViewedArea = Math.Round(avgArea, 1),
                AvgViewedPrice = Math.Round(avgPrice),
                TopCities = topCities,
                MostViewed = mostViewed
            };
        }
    }
}
