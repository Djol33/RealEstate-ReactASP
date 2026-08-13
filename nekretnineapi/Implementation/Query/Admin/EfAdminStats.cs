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
                .GroupBy(v => v.RealestateId)
                .Select(g => new { Id = g.Key, Views = g.Count() })
                .OrderByDescending(x => x.Views)
                .Take(5)
                .Select(x => x.Id)
                .ToList();

            var mostViewed = db.Realestates
                .Where(r => mostViewedIds.Contains(r.Id))
                .Include(r => r.RealestateImages)
                .Include(r => r.Wishlists)
                .ToList()
                .OrderBy(r => mostViewedIds.IndexOf(r.Id))
                .Select(r => RealEstateMapping.Map(db, actor, r))
                .ToList();

            var viewedStats = db.RealestateViews
                .Join(db.Realestates, v => v.RealestateId, r => r.Id, (v, r) => new { r.Area, r.Price })
                .ToList();

            double avgArea = viewedStats.Count > 0 ? viewedStats.Average(x => x.Area) : 0;
            decimal avgPrice = viewedStats.Count > 0 ? viewedStats.Average(x => x.Price) : 0;

            return new AdminStatsDTO
            {
                TotalUsers = db.Users.Count(),
                TotalAdmins = db.Users.Count(u => u.UserRole == UserRoles.Admin),
                TotalRealEstate = db.Realestates.Count(),
                TotalMessages = db.Messages.Count(),
                TotalViews = db.RealestateViews.Count(),
                AvgViewedArea = Math.Round(avgArea, 1),
                AvgViewedPrice = Math.Round(avgPrice),
                TopCities = topCities,
                MostViewed = mostViewed
            };
        }
    }
}
