using Application;
using Application.DTO;
using Application.Query;
using DataDomain.Entities;

namespace Implementation.Query.RealEstate
{
    public class EfShowWishlist : IShowWishlist
    {
        private readonly AppDbContext db;
        private readonly IApplicationActor actor;
        public int Id => 8;
        public string Name => "Show Wishlist";

        public EfShowWishlist(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public List<RealEstateDTO> Execute(int request)
        {
            return db.Wishlists
                .Where(w => w.UserId == request)
                .Select(w => w.Realestate)
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
                    IsWishlisted = true
                })
                .ToList();
        }
    }
}
