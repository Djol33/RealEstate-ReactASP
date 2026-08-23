using Application;
using Application.DTO.HeroBanner;
using Application.Query;
using DataDomain.Entities;

namespace Implementation.Query
{
    public class EfGetMyHeroBannerRequests : IGetMyHeroBannerRequests
    {
        public int Id => 37;
        public string Name => "Get My Hero Banner Requests";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfGetMyHeroBannerRequests(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public List<HeroBannerMyRequestDTO> Execute(int request)
        {
            return db.HeroBannerRequests
                .Where(h => h.RequestedBy == actor.Id)
                .OrderByDescending(h => h.CreatedAt)
                .Select(h => new HeroBannerMyRequestDTO
                {
                    Id = h.Id,
                    RealestateId = h.RealestateId,
                    RealestateTitle = db.Realestates.Where(r => r.Id == h.RealestateId).Select(r => r.Title).FirstOrDefault(),
                    RealestateStillExists = db.Realestates.Any(r => r.Id == h.RealestateId && r.IsActive == 1),
                    Days = h.Days,
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
