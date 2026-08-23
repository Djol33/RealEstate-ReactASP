using Application;
using Application.DTO;
using Application.Query;
using DataDomain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Implementation.Query.Recommendations
{
    public class EfShowRecommendations : IShowRecommendations
    {
        public int Id => 23;
        public string Name => "Show Recommendations";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;
        private readonly IViewerContext viewer;

        public EfShowRecommendations(AppDbContext db, IApplicationActor actor, IViewerContext viewer)
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

            var viewedIds = db.RealestateViews
                .Where(v => v.ViewerKey == key)
                .Select(v => v.RealestateId)
                .Distinct()
                .ToList();

            var wishlistIds = db.Wishlists
                .Where(w => w.UserId == actor.Id)
                .Select(w => w.RealestateId)
                .ToList();

            var interactedIds = viewedIds.Concat(wishlistIds).Distinct().ToList();
            if (interactedIds.Count == 0)
                return new List<RealEstateDTO>();

            var liked = db.Realestates
                .Where(r => interactedIds.Contains(r.Id))
                .Select(r => new { r.City, r.TypeObject, r.Price })
                .ToList();

            var topCities = liked.GroupBy(x => x.City).OrderByDescending(g => g.Count()).Select(g => g.Key).Take(3).ToList();
            var topTypes = liked.GroupBy(x => x.TypeObject).OrderByDescending(g => g.Count()).Select(g => g.Key).Take(2).ToList();
            var avgPrice = liked.Average(x => x.Price);
            var minPrice = decimal.Round(avgPrice * 0.6m, 0, MidpointRounding.AwayFromZero);
            var maxPrice = decimal.Round(avgPrice * 1.4m, 0, MidpointRounding.AwayFromZero);

            var scoredIds = db.Realestates
                .Where(r => !interactedIds.Contains(r.Id) && r.Owner != actor.Id && r.IsActive == 1 && r.Status != RealEstateStatus.Sold)
                .Select(r => new
                {
                    r.Id,
                    Score =
                        (topCities.Contains(r.City) ? 2 : 0) +
                        (topTypes.Contains(r.TypeObject) ? 2 : 0) +
                        (r.Price >= minPrice && r.Price <= maxPrice ? 1 : 0)
                })
                .Where(x => x.Score > 0)
                .OrderByDescending(x => x.Score)
                .ThenByDescending(x => x.Id)
                .Take(count)
                .Select(x => x.Id)
                .ToList();

            if (scoredIds.Count == 0)
                return new List<RealEstateDTO>();

            var entities = db.Realestates
                .Where(r => scoredIds.Contains(r.Id))
                .Include(r => r.RealestateImages)
                .Include(r => r.Wishlists)
                .ToList();

            return entities
                .OrderBy(e => scoredIds.IndexOf(e.Id))
                .Select(x => RealEstateMapping.Map(db, actor, x))
                .ToList();
        }
    }
}
