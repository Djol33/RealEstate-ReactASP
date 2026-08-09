using Application;
using Application.Command.Admin;
using DataDomain.Entities;

namespace Implementation.Command.Admin
{
    public class EfMarkContactMessageRead : IMarkContactMessageRead
    {
        public int Id => 51;
        public string Name => "Mark Contact Message Read";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfMarkContactMessageRead(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public void Execute(int request)
        {
            if (actor.UserRole != UserRoles.Admin)
                throw new UnauthorizedAccessException("Only an administrator can manage contact messages.");

            var message = db.Supports.FirstOrDefault(s => s.Id == request)
                ?? throw new KeyNotFoundException("Message not found.");

            message.IsRead = 1;
            db.SaveChanges();
        }
    }
}
