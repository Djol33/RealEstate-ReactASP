using Application;
using Application.DTO;
using Application.DTO.Query;
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

        public const int PageSize = 10;

        public RealEstatePagedDTO Execute(UserListingsQueryDTO request)
        {
            var userId = request.UserId;
            var page = request.Page < 1 ? 1 : request.Page;

            var query = db.Realestates
                .Where(x => x.Owner == userId && (x.IsActive == 1 || actor.UserRole == UserRoles.Admin));

            var totalCount = query.Count();
            var totalPages = totalCount == 0 ? 1 : (int)Math.Ceiling(totalCount / (double)PageSize);

            var data = query
                .OrderByDescending(x => x.Id)
                .Skip((page - 1) * PageSize)
                .Take(PageSize)
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
                    IsActive = x.IsActive == 1,
                    CanEdit = x.Owner == actor.Id || actor.UserRole == UserRoles.Admin,
                    CanDelete = x.Owner == actor.Id || actor.UserRole == UserRoles.Admin,
                    IsWishlisted = x.Wishlists.Any(w => w.UserId == actor.Id)
                })
                .ToList();

            return new RealEstatePagedDTO
            {
                CurrentPage = page,
                TotalPages = totalPages,
                TotalCount = totalCount,
                Data = data
            };
        }
    }
}
