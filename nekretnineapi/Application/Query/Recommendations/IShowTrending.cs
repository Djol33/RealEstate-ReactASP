using Application.DTO;
using System.Collections.Generic;

namespace Application.Query
{
    public interface IShowTrending : IQuery<int, List<RealEstateDTO>>
    {
    }
}
