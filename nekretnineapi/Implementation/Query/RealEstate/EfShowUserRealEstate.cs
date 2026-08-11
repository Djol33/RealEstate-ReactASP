using Application;
using Application.DTO;
using Application.Query;
using DataDomain.Entities;

namespace Implementation.Query.RealEstate
{
    public class EfShowUserRealEstate : IShowUserRealEstate
    {
        private readonly AppDbContext db;
        private readonly IApplicationActor actor;
        public int Id => 7;
        public string Name => "Show User Real Estate";

        public EfShowUserRealEstate(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public List<RealEstateDTO> Execute(int request)
        {
            return db.Realestates
                .Where(x => x.Owner == request)
                .OrderByDescending(x => x.Id)
                .Select(x => new RealEstateDTO
                {
                    Id = x.Id,
                    Area = x.Area,
                    CityId = x.City,
                    CityName = db.Cities.Where(c => c.Id == x.City).Select(c => c.City1).FirstOrDefault() ?? string.Empty,
                    Description = x.Description,
                    Images = x.RealestateImages.Select(o => new Images
                    {
                        Id = o.Id,
                        Location = o.Location
                    }).ToList(),
                    Price = x.Price,
                    Terrace = x.Terrace,
                    Registered = x.Registered,
                    Title = x.Title,
                    TypeObject = x.TypeObject,
                    TypeObjectName = db.TipObjekta.Where(t => t.Id == x.TypeObject).Select(t => t.Naziv).FirstOrDefault() ?? string.Empty,
                    Adress = x.Adress,
                    NumberOfRooms = x.NumberOfRooms,
                    CanEdit = x.Owner == actor.Id,
                    CanDelete = x.Owner == actor.Id || actor.UserRole == UserRoles.Admin,
                    IsWishlisted = x.Wishlists.Any(w => w.UserId == actor.Id)
                })
                .ToList();
        }
    }
}
