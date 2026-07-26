using Application;
using Application.DTO;
using Application.Query;
using DataDomain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Implementation.Query.Recommendations
{
    public class EfShowTrending : IShowTrending
    {
        public int Id => 21;
        public string Name => "Show Trending";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfShowTrending(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public List<RealEstateDTO> Execute(int count)
        {
            if (count <= 0) count = 8;

            var since = DateTime.UtcNow.AddDays(-30);

            var trendingIds = db.RealestateViews
                .Where(v => v.ViewedAt >= since)
                .GroupBy(v => v.RealestateId)
                .Select(g => new { Id = g.Key, Views = g.Count() })
                .OrderByDescending(x => x.Views)
                .Take(count)
                .Select(x => x.Id)
                .ToList();

            List<long> ids = trendingIds;

            // fallback: ako nema view-ova, najnoviji oglasi
            if (ids.Count == 0)
            {
                ids = db.Realestates
                    .OrderByDescending(r => r.Id)
                    .Take(count)
                    .Select(r => r.Id)
                    .ToList();
            }

            var entities = db.Realestates
                .Where(r => ids.Contains(r.Id))
                .Include(r => r.RealestateImages)
                .Include(r => r.Wishlists)
                .ToList();

            var items = entities.Select(x => RealEstateMapping.Map(db, actor, x)).ToList();

            // sačuvaj redosled trending-a
            return items.OrderBy(i => ids.IndexOf(i.Id)).ToList();
        }
    }
}
