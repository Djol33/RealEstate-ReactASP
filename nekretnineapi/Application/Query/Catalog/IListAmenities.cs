using Application.DTO;
using System.Collections.Generic;

namespace Application.Query
{
    public interface IListAmenities : IQuery<int, List<AmenityDTO>>
    {
    }
}
