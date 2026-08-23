using Application;
using Application.Command.Admin;
using DataDomain.Entities;
using FluentValidation;
using FluentValidation.Results;

namespace Implementation.Command.Admin
{
    public class EfCloseContactMessage : ICloseContactMessage
    {
        public int Id => 56;
        public string Name => "Close Contact Message";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfCloseContactMessage(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public void Execute(int request)
        {
            if (actor.UserRole != UserRoles.Admin)
                throw new UnauthorizedAccessException("Only an administrator can close contact messages.");

            var message = db.Supports.FirstOrDefault(s => s.Id == request)
                ?? throw new KeyNotFoundException("Message not found.");

            if (message.RepliedAt != null || message.ClosedAt != null)
                throw new ValidationException(new[] { new ValidationFailure("id", "This message has already been handled.") });

            message.IsRead = 1;
            message.ClosedAt = DateTime.Now;
            message.RepliedBy = actor.Id;
            db.SaveChanges();
        }
    }
}
