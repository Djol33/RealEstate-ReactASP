using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.Query
{
    public class CityQueryDTO
    {
   
        public string ?CityName { get; set; }
        public List<string>? CitiesToIgnore { get; set; }
    }
}
