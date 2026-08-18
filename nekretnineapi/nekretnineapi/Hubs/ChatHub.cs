using Application.Command;
using Application.DTO.Command;
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

        public ChatHub(ISendMessage sendMessage)
        {
            this.sendMessage = sendMessage;
        }

        public async Task SendMessage(int receiverId, string content)
        {
            var request = new SendMessageDTO
            {
                ReceiverId = receiverId,
                Content = content
            };

            var result = new SendMessageValidator().Validate(request);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            var dto = sendMessage.Execute(request);

            await Clients.User(receiverId.ToString()).SendAsync("ReceiveMessage", dto);
            await Clients.Caller.SendAsync("ReceiveMessage", dto);
        }
    }
}
