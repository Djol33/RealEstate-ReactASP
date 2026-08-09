using Application;
using Application.Command.Admin;
using DataDomain.Entities;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Implementation.Command.Admin
{
    public class EfDeleteContactReason : IDeleteContactReason
    {
        public int Id => 48;
        public string Name => "Delete Contact Reason";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfDeleteContactReason(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public void Execute(int request)
        {
            if (actor.UserRole != UserRoles.Admin)
                throw new UnauthorizedAccessException("Only an administrator can manage contact reasons.");

            var reason = db.ContactReasons.FirstOrDefault(r => r.Id == request)
                ?? throw new KeyNotFoundException("Reason not found.");

            db.ContactReasons.Remove(reason);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException e)
            {
                if (e.InnerException is Microsoft.Data.SqlClient.SqlException sqlEx && sqlEx.Number == 547)
                    throw new ValidationException(new[] { new FluentValidation.Results.ValidationFailure("id", "This reason is used by existing messages and cannot be deleted.") });

                throw;
            }
        }
    }
}
