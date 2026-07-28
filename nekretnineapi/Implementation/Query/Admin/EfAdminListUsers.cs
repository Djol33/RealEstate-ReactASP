using Application.DTO.Admin;
using Application.Query.Admin;
using DataDomain.Entities;

namespace Implementation.Query.Admin
{
    public class EfAdminListUsers : IAdminListUsers
    {
        public int Id => 24;
        public string Name => "Admin List Users";

        private readonly AppDbContext db;

        public EfAdminListUsers(AppDbContext db)
        {
            this.db = db;
        }

        public List<AdminUserDTO> Execute(int request)
        {
            return db.Users
                .OrderBy(u => u.Id)
                .Select(u => new AdminUserDTO
                {
                    Id = u.Id,
                    Email = u.Email,
                    UserRole = u.UserRole,
                    IsActive = u.IsActive == 1,
                    FirstName = u.UserBasics.Select(b => b.FirstName).FirstOrDefault(),
                    LastName = u.UserBasics.Select(b => b.LastName).FirstOrDefault(),
                    RealEstateCount = db.Realestates.Count(r => r.Owner == u.Id)
                })
                .ToList();
        }
    }
}
