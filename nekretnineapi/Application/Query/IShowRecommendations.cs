using Application.DTO;
using System.Collections.Generic;

namespace Application.Query
{
    public interface IShowRecommendations : IQuery<int, List<RealEstateDTO>>
    {
    }
}
