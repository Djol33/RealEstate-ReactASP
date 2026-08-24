using Application;
using Application.Command;
using Application.Command.Admin;
using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;
using FluentValidation.Results;

namespace Implementation.Command.Admin
{
    public class EfAdminDecideHeroBanner : IAdminDecideHeroBanner
    {
        public int Id => 35;
        public string Name => "Admin Decide Hero Banner";

        private readonly AppDbContext db;
        private readonly ISendSystemMessage sendSystemMessage;

        public EfAdminDecideHeroBanner(AppDbContext db, ISendSystemMessage sendSystemMessage)
        {
            this.db = db;
            this.sendSystemMessage = sendSystemMessage;
        }

        public void Execute(AdminDecideHeroBannerDTO request)
        {

            var heroRequest = db.HeroBannerRequests.FirstOrDefault(h => h.Id == request.RequestId)
                ?? throw new KeyNotFoundException("Request not found.");

            if (heroRequest.Status != HeroBannerStatus.Pending)
                throw new ValidationException(new[] { new ValidationFailure("status", "This request has already been decided.") });

            if (request.Approve)
            {
                var listingActive = db.Realestates.Any(r => r.Id == heroRequest.RealestateId && r.IsActive == 1);
                if (!listingActive)
                    throw new ValidationException(new[] { new ValidationFailure("realestateId", "This listing has been removed and cannot be featured.") });

                heroRequest.Status = HeroBannerStatus.Approved;
                heroRequest.StartsAt = DateTime.Now;
                heroRequest.EndsAt = DateTime.Now.AddDays(heroRequest.Days);
            }
            else
            {
                heroRequest.Status = HeroBannerStatus.Rejected;
            }

            db.SaveChanges();

            var listingTitle = db.Realestates.Where(r => r.Id == heroRequest.RealestateId).Select(r => r.Title).FirstOrDefault() ?? "your listing";
            var text = request.Approve
                ? $"Your hero banner request for \"{listingTitle}\" has been approved and is now featured on the homepage for {heroRequest.Days} day(s)."
                : $"Your hero banner request for \"{listingTitle}\" has been rejected.";

            sendSystemMessage.Execute(new SendSystemMessageDTO
            {
                ReceiverId = heroRequest.RequestedBy,
                Content = text
            });
        }
    }
}
