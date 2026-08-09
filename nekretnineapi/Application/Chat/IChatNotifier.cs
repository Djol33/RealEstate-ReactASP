using Application.DTO.Chat;

namespace Application.Chat
{
    public interface IChatNotifier
    {
        void NotifyNewMessage(int receiverId, MessageDTO message);
    }
}
