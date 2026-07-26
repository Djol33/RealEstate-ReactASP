using Application;
using Application.Command;
using Application.DTO.Chat;
using Application.DTO.Command;
using DataDomain.Entities;

namespace Implementation.Command
{
    public class EfSendMessage : ISendMessage
    {
        public int Id => 16;
        public string Name => "Send Message";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfSendMessage(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public MessageDTO Execute(SendMessageDTO request)
        {
            if (string.IsNullOrWhiteSpace(request.Content))
                throw new FluentValidation.ValidationException("Message cannot be empty.");

            if (request.Content.Length > 2000)
                throw new FluentValidation.ValidationException("Message is too long (max 2000 characters).");

            if (request.ReceiverId == actor.Id)
                throw new FluentValidation.ValidationException("You cannot send a message to yourself.");

            var exists = db.Users.Any(u => u.Id == request.ReceiverId);
            if (!exists)
                throw new KeyNotFoundException("Recipient does not exist.");

            var message = new Message
            {
                SenderId = actor.Id,
                ReceiverId = request.ReceiverId,
                Content = request.Content.Trim(),
                SentAt = DateTime.UtcNow,
                IsRead = false
            };

            db.Messages.Add(message);
            db.SaveChanges();

            return new MessageDTO
            {
                Id = message.Id,
                SenderId = message.SenderId,
                ReceiverId = message.ReceiverId,
                Content = message.Content,
                SentAt = message.SentAt,
                IsRead = message.IsRead
            };
        }
    }
}
