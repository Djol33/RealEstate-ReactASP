using Application;
using Application.Command;
using Application.Command.Admin;
using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;
using FluentValidation.Results;

namespace Implementation.Command.Admin
{
    public class EfAdminRevokeHeroBanner : IAdminRevokeHeroBanner
    {
        public int Id => 55;
        public string Name => "Admin Revoke Hero Banner";

        private readonly AppDbContext db;
        private readonly ISendSystemMessage sendSystemMessage;

        public EfAdminRevokeHeroBanner(AppDbContext db, ISendSystemMessage sendSystemMessage)
        {
            this.db = db;
            this.sendSystemMessage = sendSystemMessage;
        }

        public void Execute(int request)
        {

            var heroRequest = db.HeroBannerRequests.FirstOrDefault(h => h.Id == request)
                ?? throw new KeyNotFoundException("Request not found.");

            var isCurrentlyActive = heroRequest.Status == HeroBannerStatus.Approved
                && heroRequest.EndsAt.HasValue && heroRequest.EndsAt.Value > DateTime.Now;

            if (!isCurrentlyActive)
                throw new ValidationException(new[] { new ValidationFailure("status", "This listing is not currently featured.") });

            var now = DateTime.Now;
            heroRequest.EndsAt = now;
            heroRequest.RevokedAt = now;

            db.SaveChanges();

            var listingTitle = db.Realestates.Where(r => r.Id == heroRequest.RealestateId).Select(r => r.Title).FirstOrDefault() ?? "your listing";

            sendSystemMessage.Execute(new SendSystemMessageDTO
            {
                ReceiverId = heroRequest.RequestedBy,
                Content = $"Your hero banner placement for \"{listingTitle}\" has been removed by an administrator."
            });
        }
    }
}
