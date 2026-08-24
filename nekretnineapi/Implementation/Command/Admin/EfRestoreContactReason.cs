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

        public EfRestoreContactReason(AppDbContext db)
        {
            this.db = db;
        }

        public void Execute(int request)
        {

            var reason = db.ContactReasons.FirstOrDefault(r => r.Id == request)
                ?? throw new KeyNotFoundException("Reason not found.");

            reason.IsActive = true;
            db.SaveChanges();
        }
    }
}
