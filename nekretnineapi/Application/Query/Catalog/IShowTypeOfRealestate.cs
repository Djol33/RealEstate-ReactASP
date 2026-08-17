using Application.DTO;
using Application.DTO.Query;
using Application.DTO.Query.TypeOfRealestate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Query
{
    public interface IShowTypeOfRealestate : IQuery<EmptySearch, List<TypeRealEstateDTO>>
    {
    }
}
