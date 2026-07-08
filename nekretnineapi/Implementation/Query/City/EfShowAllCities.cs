using Application;
using Application.DTO;
using Application.DTO.Query;
using Application.Query;
using DataDomain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Implementation.Query.City
{
    public class EfShowAllCities
        : IShowAllCities
    {
        private readonly AppDbContext db;
        public EfShowAllCities(AppDbContext db)
        {
            this.db = db;
        }
        int IUseCase.Id => 10;

        string IUseCase.Name => "LIST OF ALL CITIES";

        public List<CityDTO> Execute(EmptySearch request)
        {
            throw new NotImplementedException();
        }

        List<CityDTO> IQuery<EmptySearch, List<CityDTO>>.Execute(EmptySearch request)
        {
           
            return this.db.Cities
               
                .Select(o => new CityDTO
                {
                    CityName = o.City1,
                    Id = o.Id,
                    ZIP = o.Zip,
                })
                .ToList();


        }
    }
}
