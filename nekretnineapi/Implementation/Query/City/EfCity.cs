using Application;
using Application.DTO;
using Application.DTO.Query;
using Application.Query;
using DataDomain.Entities;
using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Implementation.Query.City
{
    public class EfCity : ICitySearch
    {
        private readonly AppDbContext db;
        public EfCity(AppDbContext db) {
            this.db = db;
        }
        int IUseCase.Id => 2;

        string IUseCase.Name => "Search City";

        List<CityDTO> IQuery<CityQueryDTO, List<CityDTO>>.Execute(CityQueryDTO request)
        {
            var cityId = request.CitiesToIgnore
                  .Where(c => !string.IsNullOrWhiteSpace(c))
                    .SelectMany(c => c.Split(',', StringSplitOptions.RemoveEmptyEntries))
                    .Select(x => int.Parse(x.Trim()))
                    .ToList();
            return this.db.Cities
                .Where(x =>
                    (string.IsNullOrEmpty(request.CityName)
                        ? x.City1.Contains("a")
                        : x.City1.Contains(request.CityName))
                    &&
                    (  !cityId.Contains(x.Id ))
                )
                .Select(o => new CityDTO
                {
                    CityName = o.City1,
                    Id = o.Id,
                    ZIP = o.Zip,
                })
                .Take(3)
                .ToList();


        }
    }
}
