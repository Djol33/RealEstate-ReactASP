using Application.DTO.HeroBanner;
using System.Collections.Generic;

namespace Application.Query
{
    public interface IGetActiveHeroBanners : IQuery<int, List<HeroBannerActiveItemDTO>>
    {
    }
}
