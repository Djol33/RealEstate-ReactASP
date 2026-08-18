using Application.DTO;
using Application.Query;
using DataDomain.Entities;

namespace Implementation.Query
{
    public class EfListContactReasons : IListContactReasons
    {
        public int Id => 46;
        public string Name => "List Contact Reasons";

        public const int IncludeInactive = 1;

        private readonly AppDbContext db;

        public EfListContactReasons(AppDbContext db)
        {
            this.db = db;
        }

        public List<ContactReasonDTO> Execute(int request)
        {
            var query = db.ContactReasons.AsQueryable();
            if (request != IncludeInactive)
                query = query.Where(r => r.IsActive);

            return query
                .OrderBy(r => r.Name)
                .Select(r => new ContactReasonDTO
                {
                    Id = r.Id,
                    Name = r.Name,
                    IsActive = r.IsActive
                })
                .ToList();
        }
    }
}
