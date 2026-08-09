using Application.DTO.Command;

namespace Application.Command
{
    public interface ISendSystemMessage : ICommand<SendSystemMessageDTO>
    {
    }
}
