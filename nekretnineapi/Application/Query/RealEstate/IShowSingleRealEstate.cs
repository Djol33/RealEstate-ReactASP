using Application.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Query
{
    public interface IShowSingleRealEstate : IQuery<int, RealEstateDTO>
    {
    }
}
