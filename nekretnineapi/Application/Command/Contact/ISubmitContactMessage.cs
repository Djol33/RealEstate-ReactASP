using Application.DTO.Command;

namespace Application.Command
{
    public interface ISubmitContactMessage : ICommand<SubmitContactMessageDTO>
    {
    }
}
