using Application;
using Application.Command;
using Application.Command.Admin;
using Application.DTO.Command;
using Application.Email;
using DataDomain.Entities;
using FluentValidation;
using FluentValidation.Results;

namespace Implementation.Command.Admin
{
    public class EfReplyToContactMessage : IReplyToContactMessage
    {
        public int Id => 53;
        public string Name => "Reply To Contact Message";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;
        private readonly ISendSystemMessage sendSystemMessage;
        private readonly IEmailSender email;

        public EfReplyToContactMessage(AppDbContext db, IApplicationActor actor, ISendSystemMessage sendSystemMessage, IEmailSender email)
        {
            this.db = db;
            this.actor = actor;
            this.sendSystemMessage = sendSystemMessage;
            this.email = email;
        }

        public void Execute(ReplyToContactMessageDTO request)
        {

            var reply = request.Reply ?? "";

            var message = db.Supports.FirstOrDefault(s => s.Id == request.MessageId)
                ?? throw new KeyNotFoundException("Message not found.");

            if (message.RepliedAt != null || message.ClosedAt != null)
                throw new ValidationException(new[] { new ValidationFailure("reply", "This message has already been handled.") });

            var receiverExists = message.IdUser.HasValue && db.Users.Any(u => u.Id == message.IdUser.Value);

            if (receiverExists)
            {
                sendSystemMessage.Execute(new SendSystemMessageDTO
                {
                    ReceiverId = message.IdUser!.Value,
                    Content = $"Reply to your contact message: {reply}"
                });
            }
            else if (!string.IsNullOrWhiteSpace(message.Email))
            {
                var body =
                    $"<p>You contacted us regarding: <strong>{System.Net.WebUtility.HtmlEncode(message.Title)}</strong></p>" +
                    $"<p>Your message:</p><blockquote>{System.Net.WebUtility.HtmlEncode(message.Content)}</blockquote>" +
                    $"<p>Our reply:</p><p>{System.Net.WebUtility.HtmlEncode(reply)}</p>";

                email.Send(message.Email, "Reply to your message — Nekretnine", body);
            }
            else
            {
                throw new ValidationException(new[] { new ValidationFailure("reply", "This message has no user account or email to reply to.") });
            }

            message.IsRead = 1;
            message.ReplyText = reply;
            message.RepliedAt = DateTime.Now;
            message.RepliedBy = actor.Id;
            db.SaveChanges();
        }
    }
}
