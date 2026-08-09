using Application.Chat;
using Application.DTO.Chat;
using Microsoft.AspNetCore.SignalR;

namespace nekretnineapi.Hubs
{
    public class SignalRChatNotifier : IChatNotifier
    {
        private readonly IHubContext<ChatHub> hub;

        public SignalRChatNotifier(IHubContext<ChatHub> hub)
        {
            this.hub = hub;
        }

        public void NotifyNewMessage(int receiverId, MessageDTO message)
        {
            hub.Clients.User(receiverId.ToString()).SendAsync("ReceiveMessage", message);
        }
    }
}
