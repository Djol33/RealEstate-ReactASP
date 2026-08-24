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

        public EfMarkContactMessageRead(AppDbContext db)
        {
            this.db = db;
        }

        public void Execute(int request)
        {

            var message = db.Supports.FirstOrDefault(s => s.Id == request)
                ?? throw new KeyNotFoundException("Message not found.");

            message.IsRead = 1;
            db.SaveChanges();
        }
    }
}
