using Application;
using Application.DTO;
using Application.Query;
using DataDomain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Implementation.Query.Recommendations
{
    public class EfShowRecentlyViewed : IShowRecentlyViewed
    {
        public int Id => 22;
        public string Name => "Show Recently Viewed";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;
        private readonly IViewerContext viewer;

        public EfShowRecentlyViewed(AppDbContext db, IApplicationActor actor, IViewerContext viewer)
        {
            this.db = db;
            this.actor = actor;
            this.viewer = viewer;
        }

        public List<RealEstateDTO> Execute(int count)
        {
            var key = viewer.ViewerKey;
            if (string.IsNullOrEmpty(key))
                return new List<RealEstateDTO>();

            if (count <= 0) count = 8;

            var recentIds = db.RealestateViews
                .Where(v => v.ViewerKey == key)
                .GroupBy(v => v.RealestateId)
                .Select(g => new { Id = g.Key, LastAt = g.Max(v => v.ViewedAt) })
                .OrderByDescending(x => x.LastAt)
                .Take(count)
                .Select(x => x.Id)
                .ToList();

            if (recentIds.Count == 0)
                return new List<RealEstateDTO>();

            var entities = db.Realestates
                .Where(r => recentIds.Contains(r.Id) && r.IsActive == 1)
                .Include(r => r.RealestateImages)
                .Include(r => r.Wishlists)
                .ToList();

            var items = entities.Select(x => RealEstateMapping.Map(db, actor, x)).ToList();

            return items.OrderBy(i => recentIds.IndexOf(i.Id)).ToList();
        }
    }
}
