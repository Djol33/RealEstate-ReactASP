using Application.DTO;
using Application.DTO.Admin;
using System.Collections.Generic;

namespace Application.Query.Admin
{
    public interface IAdminListReports : IQuery<int, PagedResult<ReportAdminListItemDTO>>
    {
    }
}
