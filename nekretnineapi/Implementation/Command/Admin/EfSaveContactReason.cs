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
            if (string.IsNullOrWhiteSpace(name))
                throw new ValidationException(new[] { new ValidationFailure("name", "Reason name cannot be empty.") });
            if (name.Length > 80)
                throw new ValidationException(new[] { new ValidationFailure("name", "Reason name cannot exceed 80 characters.") });

            if (db.ContactReasons.Any(r => r.Name == name && r.Id != request.Id))
                throw new ValidationException(new[] { new ValidationFailure("name", "A reason with this name already exists.") });

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
