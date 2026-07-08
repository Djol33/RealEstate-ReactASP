using Application;
using Application.DTO;
using Application.Query;
using DataDomain.Entities;

namespace Implementation.Query.RealEstate
{
    public class SingleRealEstate : IShowSingleRealEstate
    {
        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public int Id => 3;
        public string Name => "Single real estate";

        public SingleRealEstate(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public RealEstateDTO Execute(int request)
        {
    
            var realestate = this.db.Realestates
                .Where(a => a.Id == request)
                .Select(a => new RealEstateDTO
                {
                    Id = a.Id,
                    Area = a.Area,
                    Description = a.Description,
                    TypeObjectName = a.TypeObjectNavigation.Naziv,
                    Price = a.Price,
                    NumberOfRooms = a.NumberOfRooms,
                    Terrace = a.Terrace,
                    Title = a.Title,
                    CityId = db.Cities.Where(c => c.Id == a.City).Select(c => c.Id).FirstOrDefault(),
                    TypeObject=a.TypeObjectNavigation.Id,
                    CityName = db.Cities.Where(c => c.Id == a.City).Select(c => c.City1).FirstOrDefault() ?? string.Empty,
                    Adress = a.Adress,
                    Images = a.RealestateImages.Select(x => new Images
                    {
                        Id = x.Id,
                        Location = x.Location
                    }).ToList(),
                    CanEdit = a.Owner == actor.Id ,
                    Lng = a.Lng ?? null,
                    Lat = a.Lat ??null
                })
                .FirstOrDefault()
                ?? throw new KeyNotFoundException("Nekretnina nije pronađena.");

            return realestate;
        }
    }
}
