using Application.DTO.Admin;
using System.Collections.Generic;

namespace Application.Query.Admin
{
    public interface IAdminListContactMessages : IQuery<ContactMessageQueryDTO, List<ContactMessageAdminListItemDTO>>
    {
    }
}
