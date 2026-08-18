using Application;
using Application.Command.Admin;
using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;
using FluentValidation.Results;

namespace Implementation.Command.Admin
{
    public class EfSaveContactReason : ISaveContactReason
    {
        public int Id => 47;
        public string Name => "Save Contact Reason";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfSaveContactReason(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public void Execute(SaveContactReasonDTO request)
        {
            if (actor.UserRole != UserRoles.Admin)
                throw new UnauthorizedAccessException("Only an administrator can manage contact reasons.");

            var name = (request.Name ?? "").Trim();

            var conflicting = db.ContactReasons.FirstOrDefault(r => r.Name == name && r.Id != request.Id);
            if (conflicting != null)
            {
                var message = conflicting.IsActive
                    ? "A reason with this name already exists."
                    : "A reason with this name was previously deleted. Restore it instead of creating a new one.";
                throw new ValidationException(new[] { new ValidationFailure("name", message) });
            }

            if (request.Id > 0)
            {
                var reason = db.ContactReasons.FirstOrDefault(r => r.Id == request.Id)
                    ?? throw new KeyNotFoundException("Reason not found.");

                reason.Name = name;
            }
            else
            {
                db.ContactReasons.Add(new ContactReason
                {
                    Name = name,
                    CreatedAt = DateTime.Now
                });
            }

            db.SaveChanges();
        }
    }
}
