using Application.DTO;
using System.Collections.Generic;

namespace Application.Query
{
    public interface IShowRecentlyViewed : IQuery<int, List<RealEstateDTO>>
    {
    }
}
