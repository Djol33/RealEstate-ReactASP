using Application.DTO.Admin;
using Application.Query.Admin;
using DataDomain.Entities;

namespace Implementation.Query.Admin
{
    public class EfAdminListContactMessages : IAdminListContactMessages
    {
        public int Id => 50;
        public string Name => "Admin List Contact Messages";

        private readonly AppDbContext db;

        public EfAdminListContactMessages(AppDbContext db)
        {
            this.db = db;
        }

        public List<ContactMessageAdminListItemDTO> Execute(int request)
        {
            return db.Supports
                .OrderBy(s => s.IsRead)
                .ThenByDescending(s => s.DateReported)
                .Select(s => new ContactMessageAdminListItemDTO
                {
                    Id = s.Id,
                    FirstName = s.FName,
                    LastName = s.LName,
                    Email = s.Email,
                    ReasonName = s.ReasonNavigation != null ? s.ReasonNavigation.Name : "—",
                    Message = s.Content,
                    IsRead = s.IsRead == 1,
                    CreatedAt = s.DateReported
                })
                .ToList();
        }
    }
}
