using Application.DTO.HeroBanner;
using System.Collections.Generic;

namespace Application.Query
{
    public interface IGetMyHeroBannerRequests : IQuery<int, List<HeroBannerMyRequestDTO>>
    {
    }
}
