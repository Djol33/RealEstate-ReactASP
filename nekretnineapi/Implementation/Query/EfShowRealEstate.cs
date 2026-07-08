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

            if (req.MinPrice.HasValue) query = query.Where(x => x.Price >= req.MinPrice.Value);
            if (req.MaxPrice.HasValue) query = query.Where(x => x.Price <= req.MaxPrice.Value);
            if (req.TypeObject.HasValue) query = query.Where(x => x.TypeObject == req.TypeObject.Value);
            if (req.MinRooms.HasValue) query = query.Where(x => x.NumberOfRooms >= req.MinRooms.Value);
            if (!string.IsNullOrWhiteSpace(req.Title)) query = query.Where(x => x.Title.Contains(req.Title));

            var totalCount = query.Count();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var data = query
                .OrderByDescending(x => x.Id)
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
                    Price = x.Price,
                    Terrace = x.Terrace,
                    Title = x.Title,
                    TypeObject = x.TypeObject,
                    TypeObjectName = this.db.TipObjekta.Where(t => t.Id == x.TypeObject).Select(t => t.Naziv).FirstOrDefault() ?? string.Empty,
                    Adress = x.Adress,
                    NumberOfRooms = x.NumberOfRooms,
                    CityId = x.City,
                    CanEdit = x.Owner == actor.Id
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
