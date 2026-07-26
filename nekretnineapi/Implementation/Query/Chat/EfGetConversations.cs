using Application;
using Application.DTO.Chat;
using Application.Query;
using DataDomain.Entities;

namespace Implementation.Query.Chat
{
    public class EfGetConversations : IGetConversations
    {
        public int Id => 19;
        public string Name => "Get Conversations";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfGetConversations(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public List<ConversationSummaryDTO> Execute(int request)
        {
            var me = actor.Id;

            var myMessages = db.Messages
                .Where(m => m.SenderId == me || m.ReceiverId == me)
                .Select(m => new
                {
                    OtherId = m.SenderId == me ? m.ReceiverId : m.SenderId,
                    m.Content,
                    m.SentAt,
                    m.IsRead,
                    m.ReceiverId
                })
                .ToList();

            var summaries = myMessages
                .GroupBy(m => m.OtherId)
                .Select(g =>
                {
                    var last = g.OrderByDescending(x => x.SentAt).First();
                    return new ConversationSummaryDTO
                    {
                        OtherUserId = g.Key,
                        LastMessage = last.Content,
                        LastAt = last.SentAt,
                        UnreadCount = g.Count(x => x.ReceiverId == me && !x.IsRead)
                    };
                })
                .OrderByDescending(s => s.LastAt)
                .ToList();

            var otherIds = summaries.Select(s => s.OtherUserId).ToList();
            var names = db.UserBasics
                .Where(b => otherIds.Contains(b.FkId))
                .Select(b => new { b.FkId, b.FirstName, b.LastName })
                .ToList();

            foreach (var s in summaries)
            {
                var n = names.FirstOrDefault(x => x.FkId == s.OtherUserId);
                s.OtherUserName = n != null ? $"{n.FirstName} {n.LastName}" : "Korisnik";
            }

            return summaries;
        }
    }
}
