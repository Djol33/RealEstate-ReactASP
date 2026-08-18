using Application;
using Application.Command;
using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;
using FluentValidation.Results;

namespace Implementation.Command
{
    public class EfReportRealestate : IReportRealestate
    {
        public int Id => 38;
        public string Name => "Report Realestate";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfReportRealestate(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public void Execute(ReportRealestateDTO request)
        {
            if (actor.Id == 0)
                throw new UnauthorizedAccessException("You must be logged in to report a listing.");

            var realestate = db.Realestates.FirstOrDefault(r => r.Id == request.RealestateId && r.IsActive == 1)
                ?? throw new KeyNotFoundException("Listing not found.");

            if (realestate.Owner == actor.Id)
                throw Fail("realestateId", "You cannot report your own listing.");

            var alreadyReported = db.RealestateReports.Any(rr =>
                rr.RealestateId == request.RealestateId &&
                rr.ReportedBy == actor.Id &&
                rr.Status == ReportStatus.Pending);
            if (alreadyReported)
                throw Fail("realestateId", "You have already reported this listing. It is pending review.");

            var details = request.Details?.Trim();

            db.RealestateReports.Add(new RealestateReport
            {
                RealestateId = request.RealestateId,
                ReportedBy = actor.Id,
                Reason = request.Reason,
                Details = string.IsNullOrWhiteSpace(details) ? null : details,
                Status = ReportStatus.Pending,
                CreatedAt = DateTime.Now
            });
            db.SaveChanges();
        }

        private static ValidationException Fail(string property, string message)
            => new ValidationException(new[] { new ValidationFailure(property, message) });
    }
}
