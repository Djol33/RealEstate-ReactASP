using Application;
using Application.Command;
using Application.Command.Admin;
using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;

namespace Implementation.Command.Admin
{
    public class EfAdminDecideReport : IAdminDecideReport
    {
        public int Id => 40;
        public string Name => "Admin Decide Report";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;
        private readonly IDeleteRealestate deleteRealestate;
        private readonly ISendSystemMessage sendSystemMessage;

        public EfAdminDecideReport(AppDbContext db, IApplicationActor actor, IDeleteRealestate deleteRealestate, ISendSystemMessage sendSystemMessage)
        {
            this.db = db;
            this.actor = actor;
            this.deleteRealestate = deleteRealestate;
            this.sendSystemMessage = sendSystemMessage;
        }

        public void Execute(AdminDecideReportDTO request)
        {
            if (actor.UserRole != UserRoles.Admin)
                throw new UnauthorizedAccessException("Only an administrator can decide reports.");

            var report = db.RealestateReports.FirstOrDefault(r => r.Id == request.ReportId)
                ?? throw new KeyNotFoundException("Report not found.");

            if (report.Status != ReportStatus.Pending)
                throw new ValidationException(new[] { new FluentValidation.Results.ValidationFailure("status", "This report has already been decided.") });

            var realestateId = report.RealestateId;

            if (request.DeleteListing)
            {
                var listing = db.Realestates.FirstOrDefault(r => r.Id == realestateId);
                if (listing == null)
                    throw new KeyNotFoundException("This listing has already been removed.");

                var listingTitle = listing.Title;
                var ownerId = listing.Owner;

                deleteRealestate.Execute(realestateId);

                var relatedReports = db.RealestateReports
                    .Where(r => r.RealestateId == realestateId && r.Status == ReportStatus.Pending)
                    .ToList();
                foreach (var related in relatedReports)
                    related.Status = ReportStatus.Actioned;

                sendSystemMessage.Execute(new SendSystemMessageDTO
                {
                    ReceiverId = ownerId,
                    Content = $"Your listing \"{listingTitle}\" has been removed by an administrator following a user report."
                });
            }
            else
            {
                report.Status = ReportStatus.Dismissed;
            }

            db.SaveChanges();
        }
    }
}
