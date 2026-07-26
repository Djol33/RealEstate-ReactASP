using Application;
using Application.DTO.Chat;
using Application.Query;
using DataDomain.Entities;

namespace Implementation.Query.Chat
{
    public class EfGetConversation : IGetConversation
    {
        public int Id => 17;
        public string Name => "Get Conversation";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfGetConversation(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public List<MessageDTO> Execute(int otherUserId)
        {
            var me = actor.Id;

            return db.Messages
                .Where(m =>
                    (m.SenderId == me && m.ReceiverId == otherUserId) ||
                    (m.SenderId == otherUserId && m.ReceiverId == me))
                .OrderBy(m => m.SentAt)
                .Select(m => new MessageDTO
                {
                    Id = m.Id,
                    SenderId = m.SenderId,
                    ReceiverId = m.ReceiverId,
                    Content = m.Content,
                    SentAt = m.SentAt,
                    IsRead = m.IsRead
                })
                .ToList();
        }
    }
}
