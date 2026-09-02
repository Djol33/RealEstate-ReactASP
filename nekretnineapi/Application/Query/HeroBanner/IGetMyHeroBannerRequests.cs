using Application.DTO;
using Application.DTO.HeroBanner;

namespace Application.Query
{
    public interface IGetMyHeroBannerRequests : IQuery<int, PagedResult<HeroBannerMyRequestDTO>>
    {
    }
}
