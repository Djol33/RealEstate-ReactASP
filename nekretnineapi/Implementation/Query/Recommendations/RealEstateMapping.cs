using Application;
using Application.DTO;
using DataDomain.Entities;
using System.Linq.Expressions;

namespace Implementation.Query.Recommendations
{
    internal static class RealEstateMapping
    {
        public static RealEstateDTO Map(AppDbContext db, IApplicationActor actor, Realestate x)
        {
            return new RealEstateDTO
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
            };
        }
    }
}
