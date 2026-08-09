using Application.DTO;
using Application.Query;
using DataDomain.Entities;

namespace Implementation.Query
{
    public class EfListContactReasons : IListContactReasons
    {
        public int Id => 46;
        public string Name => "List Contact Reasons";

        private readonly AppDbContext db;

        public EfListContactReasons(AppDbContext db)
        {
            this.db = db;
        }

        public List<ContactReasonDTO> Execute(int request)
        {
            return db.ContactReasons
                .OrderBy(r => r.Name)
                .Select(r => new ContactReasonDTO
                {
                    Id = r.Id,
                    Name = r.Name
                })
                .ToList();
        }
    }
}
