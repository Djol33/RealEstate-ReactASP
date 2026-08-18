using Application;
using Application.DTO;
using Application.DTO.Query;
using Application.Query;
using DataDomain.Entities;

namespace Implementation.Query
{
    public class EfShowRealEstate : IShowRealEstate
    {
        private readonly AppDbContext db;
        private readonly IApplicationActor actor;
        public int Id => 1;
        public string Name => "Show Real Estate";

        public EfShowRealEstate(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public RealEstatePagedDTO Execute(RealEstateQueryDTO req)
        {
            const int pageSize = 20;
            var page = req.Page < 1 ? 1 : req.Page;

            var query = this.db.Realestates.AsQueryable();

            if (!(req.IncludeInactive && actor.UserRole == UserRoles.Admin))
                query = query.Where(x => x.IsActive == 1);

            if (!string.IsNullOrWhiteSpace(req.City))
            {
                var cityIds = req.City
                    .Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(x => x.Trim())
                    .Where(x => int.TryParse(x, out _))
                    .Select(int.Parse)
                    .ToList();

                if (cityIds.Any())
                    query = query.Where(x => cityIds.Contains(x.City));
            }

            if (!string.IsNullOrWhiteSpace(req.Search))
            {
                var term = req.Search.Trim();
                query = query.Where(x =>
                    x.Title.Contains(term) ||
                    x.Adress.Contains(term) ||
                    x.Id.ToString().Contains(term));
            }

            if (req.MinPrice.HasValue) query = query.Where(x => x.Price >= req.MinPrice.Value);
            if (req.MaxPrice.HasValue) query = query.Where(x => x.Price <= req.MaxPrice.Value);
            if (req.TypeObject.HasValue) query = query.Where(x => x.TypeObject == req.TypeObject.Value);
            if (req.MinRooms.HasValue) query = query.Where(x => x.NumberOfRooms >= req.MinRooms.Value);
            if (req.Registered.HasValue) query = query.Where(x => x.Registered == req.Registered.Value);
            if (!string.IsNullOrWhiteSpace(req.Title)) query = query.Where(x => x.Title.Contains(req.Title));

            if (!string.IsNullOrWhiteSpace(req.AmenityIds))
            {
                var amenityIds = req.AmenityIds
                    .Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(x => x.Trim())
                    .Where(x => int.TryParse(x, out _))
                    .Select(int.Parse)
                    .ToList();

                foreach (var amenityId in amenityIds)
                    query = query.Where(x => x.Amenities.Any(a => a.Id == amenityId));
            }

            var totalCount = query.Count();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            query = req.SortBy switch
            {
                "priceAsc" => query.OrderBy(x => x.Price),
                "priceDesc" => query.OrderByDescending(x => x.Price),
                "areaDesc" => query.OrderByDescending(x => x.Area),
                _ => query.OrderByDescending(x => x.Id)
            };

            var data = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new RealEstateDTO
                {
                    Id = x.Id,
                    Area = x.Area,
                    CityName = this.db.Cities.Where(c => c.Id == x.City).Select(c => c.City1).FirstOrDefault() ?? string.Empty,
                    Description = x.Description,
                    Images = x.RealestateImages.Select(o => new Images
                    {
                        Id = o.Id,
                        Location = o.Location
                    }).ToList(),
                    Amenities = x.Amenities.Where(am => am.IsActive).Select(am => new AmenityDTO
                    {
                        Id = am.Id,
                        Name = am.Name,
                        IsFilterable = am.IsFilterable
                    }).ToList(),
                    Price = x.Price,
                    Terrace = x.Terrace,
                    Registered = x.Registered,
                    Title = x.Title,
                    TypeObject = x.TypeObject,
                    TypeObjectName = this.db.TipObjekta.Where(t => t.Id == x.TypeObject).Select(t => t.Naziv).FirstOrDefault() ?? string.Empty,
                    Adress = x.Adress,
                    NumberOfRooms = x.NumberOfRooms,
                    CityId = x.City,
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
