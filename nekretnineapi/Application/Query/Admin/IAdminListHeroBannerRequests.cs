using Application.DTO;
using Application.DTO.HeroBanner;
using System.Collections.Generic;

namespace Application.Query.Admin
{
    public interface IAdminListHeroBannerRequests : IQuery<int, PagedResult<HeroBannerAdminListItemDTO>>
    {
    }
}
