using Application.DTO.Chat;
using Application.DTO.Command;

namespace Application.Command
{
    public interface ISendMessage : IQuery<SendMessageDTO, MessageDTO>
    {
    }
}
