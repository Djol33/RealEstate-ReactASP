using Application;
using Application.Chat;
using Application.Command;
using Application.DTO.Chat;
using Application.DTO.Command;
using DataDomain.Entities;

namespace Implementation.Command
{
    public class EfSendSystemMessage : ISendSystemMessage
    {
        public int Id => 52;
        public string Name => "Send System Message";

        private readonly AppDbContext db;
        private readonly IChatNotifier notifier;

        public EfSendSystemMessage(AppDbContext db, IChatNotifier notifier)
        {
            this.db = db;
            this.notifier = notifier;
        }

        public void Execute(SendSystemMessageDTO request)
        {
            if (string.IsNullOrWhiteSpace(request.Content))
                return;

            if (request.ReceiverId == SystemUser.Id)
                return;

            var exists = db.Users.Any(u => u.Id == request.ReceiverId && u.IsActive == 1);
            if (!exists)
                return;

            var senderExists = db.Users.Any(u => u.Id == SystemUser.Id);
            if (!senderExists)
                return;

            var message = new Message
            {
                SenderId = SystemUser.Id,
                ReceiverId = request.ReceiverId,
                Content = request.Content.Trim(),
                SentAt = DateTime.UtcNow,
                IsRead = false
            };

            db.Messages.Add(message);
            db.SaveChanges();

            var dto = new MessageDTO
            {
                Id = message.Id,
                SenderId = message.SenderId,
                ReceiverId = message.ReceiverId,
                Content = message.Content,
                SentAt = message.SentAt,
                IsRead = message.IsRead
            };

            notifier.NotifyNewMessage(request.ReceiverId, dto);
        }
    }
}
