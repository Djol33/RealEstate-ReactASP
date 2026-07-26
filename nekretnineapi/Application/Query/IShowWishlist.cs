using Application.DTO;
using System.Collections.Generic;

namespace Application.Query
{
    public interface IShowWishlist : IQuery<int, List<RealEstateDTO>>
    {
    }
}
