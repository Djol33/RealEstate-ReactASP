using Application;
using Application.DTO;
using Application.Query;
using DataDomain.Entities;

namespace Implementation.Query
{
    public class EfGetRealestateAnalytics : IGetRealestateAnalytics
    {
        public int Id => 42;
        public string Name => "Get Realestate Analytics";

        private const int TrendDays = 14;

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfGetRealestateAnalytics(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public RealestateAnalyticsDTO Execute(long request)
        {
            var realestate = db.Realestates.FirstOrDefault(r => r.Id == request)
                ?? throw new KeyNotFoundException("Listing not found.");

            if (realestate.Owner != actor.Id)
                throw new UnauthorizedAccessException("You can only view analytics for your own listings.");

            var isCompany = db.Companies.Any(c => c.FkId == actor.Id);
            if (!isCompany)
                throw new UnauthorizedAccessException("Analytics are available to companies only.");

            var views = db.RealestateViews.Where(v => v.RealestateId == request).ToList();

            var since = DateTime.Now.Date.AddDays(-(TrendDays - 1));
            var viewsByDay = views
                .Where(v => v.ViewedAt >= since)
                .GroupBy(v => v.ViewedAt.Date)
                .ToDictionary(g => g.Key, g => g.Count());

            var trend = new List<DailyViewCount>();
            for (var day = since; day <= DateTime.Now.Date; day = day.AddDays(1))
            {
                trend.Add(new DailyViewCount
                {
                    Date = day,
                    Count = viewsByDay.TryGetValue(day, out var count) ? count : 0
                });
            }

            var durations = views.Where(v => v.DurationSeconds.HasValue).Select(v => v.DurationSeconds!.Value).ToList();

            return new RealestateAnalyticsDTO
            {
                TotalViews = views.Count,
                WishlistCount = db.Wishlists.Count(w => w.RealestateId == request),
                AverageDurationSeconds = durations.Count > 0 ? durations.Average() : null,
                ViewsByDay = trend
            };
        }
    }
}
