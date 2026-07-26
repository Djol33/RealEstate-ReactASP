using Application.Command;
using Application.DTO.Command;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

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
            var dto = sendMessage.Execute(new SendMessageDTO
            {
                ReceiverId = receiverId,
                Content = content
            });

            await Clients.User(receiverId.ToString()).SendAsync("ReceiveMessage", dto);
            await Clients.Caller.SendAsync("ReceiveMessage", dto);
        }
    }
}
