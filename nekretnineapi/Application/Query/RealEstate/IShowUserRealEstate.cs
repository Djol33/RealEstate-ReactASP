using Application.DTO;
using System.Collections.Generic;

namespace Application.Query
{
    public interface IShowUserRealEstate : IQuery<int, List<RealEstateDTO>>
    {
    }
}
