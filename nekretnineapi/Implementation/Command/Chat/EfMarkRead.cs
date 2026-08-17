using Application;
using Application.Command;
using DataDomain.Entities;

namespace Implementation.Command
{
    public class EfMarkRead : IMarkRead
    {
        public int Id => 18;
        public string Name => "Mark Messages Read";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfMarkRead(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public void Execute(int otherUserId)
        {
            var me = actor.Id;

            var unread = db.Messages
                .Where(m => m.SenderId == otherUserId && m.ReceiverId == me && !m.IsRead)
                .ToList();

            if (unread.Count == 0)
                return;

            foreach (var m in unread)
                m.IsRead = true;

            db.SaveChanges();
        }
    }
}
