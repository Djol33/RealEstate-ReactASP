using Application.DTO.Admin;
using System.Collections.Generic;

namespace Application.Query.Admin
{
    public interface IAdminListUsers : IQuery<int, List<AdminUserDTO>>
    {
    }
}
