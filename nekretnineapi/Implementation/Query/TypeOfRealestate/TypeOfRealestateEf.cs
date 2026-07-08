using Application;
using Application.DTO.Query;
using Application.DTO.Query.TypeOfRealestate;
using Application.Query;
using DataDomain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Implementation.Query.TypeOfRealestate
{
    public class TypeOfRealestateEf : IShowTypeOfRealestate
    {

        private readonly AppDbContext db;
        public TypeOfRealestateEf(AppDbContext db)
        {
            this.db = db;
        }
        int IUseCase.Id => 2;

        string IUseCase.Name => "Type of Object";

        public List<TypeRealEstateDTO> Execute(EmptySearch request)
        {
            return db.TipObjekta.Select(x => new TypeRealEstateDTO
            {
                Id = x.Id,
                Naziv = x.Naziv
            }).ToList();
        }
    }
}
