using Application.DTO;
using Application.Query;
using DataDomain.Entities;

namespace Implementation.Query
{
    public class EfListAmenities : IListAmenities
    {
        public int Id => 43;
        public string Name => "List Amenities";

        public const int IncludeInactive = 1;

        private readonly AppDbContext db;

        public EfListAmenities(AppDbContext db)
        {
            this.db = db;
        }

        public List<AmenityDTO> Execute(int request)
        {
            var query = db.Amenities.AsQueryable();
            if (request != IncludeInactive)
                query = query.Where(a => a.IsActive);

            return query
                .OrderBy(a => a.Name)
                .Select(a => new AmenityDTO
                {
                    Id = a.Id,
                    Name = a.Name,
                    IsFilterable = a.IsFilterable,
                    IsActive = a.IsActive
                })
                .ToList();
        }
    }
}
