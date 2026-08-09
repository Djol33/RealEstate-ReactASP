using Application.DTO;
using Application.Query;
using DataDomain.Entities;

namespace Implementation.Query
{
    public class EfListAmenities : IListAmenities
    {
        public int Id => 43;
        public string Name => "List Amenities";

        private readonly AppDbContext db;

        public EfListAmenities(AppDbContext db)
        {
            this.db = db;
        }

        public List<AmenityDTO> Execute(int request)
        {
            return db.Amenities
                .OrderBy(a => a.Name)
                .Select(a => new AmenityDTO
                {
                    Id = a.Id,
                    Name = a.Name,
                    IsFilterable = a.IsFilterable
                })
                .ToList();
        }
    }
}
