using Application.DTO.Command;

namespace Application.Command
{
    public interface IRequestPasswordReset : ICommand<RequestPasswordResetDTO>
    {
    }
}
