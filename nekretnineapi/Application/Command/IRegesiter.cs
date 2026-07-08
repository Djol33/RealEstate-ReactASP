using Application.DTO.Command;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Command
{
    public interface IRegesiter : ICommand<RegisterUserDTO>
    {
    }


    public interface IRegisterCompany : ICommand<RegisterCompanyDTO> { }
}
