using Application;
using Application.Command;
using Application.DTO.HeroBanner;
using Application.HeroBanner;
using DataDomain.Entities;
using FluentValidation;

namespace Implementation.Command
{
    public class EfRequestHeroBanner : IRequestHeroBanner
    {
        public int Id => 33;
        public string Name => "Request Hero Banner";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;
        private readonly IHeroBannerPricing pricing;

        public EfRequestHeroBanner(AppDbContext db, IApplicationActor actor, IHeroBannerPricing pricing)
        {
            this.db = db;
            this.actor = actor;
            this.pricing = pricing;
        }

        public void Execute(HeroBannerRequestDTO request)
        {
            if (actor.Id == 0)
                throw new UnauthorizedAccessException("You must be logged in.");

            var realestate = db.Realestates.FirstOrDefault(r => r.Id == request.RealestateId && r.IsActive == 1)
                ?? throw new KeyNotFoundException("Listing not found.");

            if (realestate.Owner != actor.Id)
                throw new UnauthorizedAccessException("You can only promote your own listings.");

            var isCompany = db.Companies.Any(c => c.FkId == actor.Id);
            if (!isCompany)
                throw new UnauthorizedAccessException("Only companies can request hero banner placement.");

            var hasPending = db.HeroBannerRequests.Any(h =>
                h.RealestateId == request.RealestateId &&
                (h.Status == HeroBannerStatus.Pending ||
                 (h.Status == HeroBannerStatus.Approved && h.EndsAt > DateTime.Now)));
            if (hasPending)
                throw Fail("realestateId", "This listing already has a pending or active hero banner request.");

            var totalPrice = pricing.PricePerDay * request.Days;

            db.HeroBannerRequests.Add(new HeroBannerRequest
            {
                RealestateId = request.RealestateId,
                RequestedBy = actor.Id,
                Days = request.Days,
                PricePerDay = pricing.PricePerDay,
                TotalPrice = totalPrice,
                Status = HeroBannerStatus.Pending,
                CreatedAt = DateTime.Now
            });
            db.SaveChanges();
        }

        private static ValidationException Fail(string property, string message)
            => new ValidationException(new[] { new FluentValidation.Results.ValidationFailure(property, message) });
    }
}
