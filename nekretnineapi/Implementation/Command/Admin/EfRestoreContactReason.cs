using Application;
using Application.Command.Admin;
using DataDomain.Entities;

namespace Implementation.Command.Admin
{
    public class EfRestoreContactReason : IRestoreContactReason
    {
        public int Id => 55;
        public string Name => "Restore Contact Reason";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfRestoreContactReason(AppDbContext db, IApplicationActor actor)
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

            reason.IsActive = true;
            db.SaveChanges();
        }
    }
}
