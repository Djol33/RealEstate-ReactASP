using Application.DTO.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Query
{
    public interface IUserProfile : IQuery<int, UserProfileDTO>
    {


    }
}
