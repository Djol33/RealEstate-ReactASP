using Application.DTO.Admin;
using Application.Query.Admin;
using DataDomain.Entities;

namespace Implementation.Query.Admin
{
    public class EfAdminListUsers : IAdminListUsers
    {
        public int Id => 24;
        public string Name => "Admin List Users";

        private const int PageSize = 10;

        private readonly AppDbContext db;

        public EfAdminListUsers(AppDbContext db)
        {
            this.db = db;
        }

        public AdminUserPagedDTO Execute(AdminUserQueryDTO request)
        {
            var page = request.Page < 1 ? 1 : request.Page;

            var query = db.Users.AsQueryable();

            var search = (request.Search ?? "").Trim();
            if (search.Length > 0)
            {
                query = query.Where(u =>
                    u.Email.Contains(search) ||
                    u.UserBasics.Any(b => b.FirstName.Contains(search) || b.LastName.Contains(search)));
            }

            var totalCount = query.Count();
            var totalPages = totalCount == 0 ? 1 : (int)Math.Ceiling(totalCount / (double)PageSize);

            var pageUsers = query
                .OrderBy(u => u.Id)
                .Skip((page - 1) * PageSize)
                .Take(PageSize)
                .Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.UserRole,
                    u.IsActive,
                    FirstName = u.UserBasics.Select(b => b.FirstName).FirstOrDefault(),
                    LastName = u.UserBasics.Select(b => b.LastName).FirstOrDefault(),
                    CompanyName = u.Companies.Select(c => c.Name).FirstOrDefault()
                })
                .ToList();

            var userIds = pageUsers.Select(u => u.Id).ToList();
            var listingCountsByOwner = db.Realestates
                .Where(r => userIds.Contains(r.Owner) && r.IsActive == 1)
                .GroupBy(r => r.Owner)
                .Select(g => new { OwnerId = g.Key, Count = g.Count() })
                .ToDictionary(x => x.OwnerId, x => x.Count);

            var data = pageUsers.Select(u => new AdminUserDTO
            {
                Id = u.Id,
                Email = u.Email,
                UserRole = u.UserRole,
                IsActive = u.IsActive == 1,
                FirstName = u.FirstName,
                LastName = u.LastName,
                CompanyName = u.CompanyName,
                IsCompany = u.CompanyName != null,
                RealEstateCount = listingCountsByOwner.GetValueOrDefault(u.Id)
            }).ToList();

            return new AdminUserPagedDTO
            {
                CurrentPage = page,
                TotalPages = totalPages,
                TotalCount = totalCount,
                Data = data
            };
        }
    }
}
