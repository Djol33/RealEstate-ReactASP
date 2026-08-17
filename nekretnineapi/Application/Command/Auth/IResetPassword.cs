using Application.DTO.Command;

namespace Application.Command
{
    public interface IResetPassword : ICommand<ResetPasswordDTO>
    {
    }
}
