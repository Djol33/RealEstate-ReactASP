using Application.DTO;
using Application.DTO.Command;

namespace Application.Command
{
    public interface ILogin : IQuery<LoginDTO, LoginResultDTO>
    {
    }
}
