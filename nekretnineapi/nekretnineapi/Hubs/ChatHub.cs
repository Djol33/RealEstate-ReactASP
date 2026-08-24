using Application;
using Application.Command;
using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using nekretnineapi.Validators;

namespace nekretnineapi.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly ISendMessage sendMessage;
        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public ChatHub(ISendMessage sendMessage, AppDbContext db, IApplicationActor actor)
        {
            this.sendMessage = sendMessage;
            this.db = db;
            this.actor = actor;
        }

        public async Task SendMessage(int receiverId, string content)
        {
            var request = new SendMessageDTO
            {
                ReceiverId = receiverId,
                Content = content
            };

            var result = new SendMessageValidator(db, actor).Validate(request);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            var dto = sendMessage.Execute(request);

            await Clients.User(receiverId.ToString()).SendAsync("ReceiveMessage", dto);
            await Clients.Caller.SendAsync("ReceiveMessage", dto);
        }
    }
}
