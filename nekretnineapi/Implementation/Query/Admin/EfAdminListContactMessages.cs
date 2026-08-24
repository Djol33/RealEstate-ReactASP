using Application.DTO;
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

        public PagedResult<ContactMessageAdminListItemDTO> Execute(ContactMessageQueryDTO request)
        {
            var query = db.Supports.AsQueryable();

            query = request.Handled
                ? query.Where(s => s.RepliedAt != null || s.ClosedAt != null)
                : query.Where(s => s.RepliedAt == null && s.ClosedAt == null);

            if (request.ReasonId.HasValue && request.ReasonId.Value > 0)
                query = query.Where(s => s.ReasonId == request.ReasonId.Value);

            var search = (request.Search ?? "").Trim();
            if (search.Length > 0)
            {
                query = query.Where(s =>
                    s.Email.Contains(search) ||
                    s.FName.Contains(search) ||
                    s.LName.Contains(search) ||
                    s.Content.Contains(search));
            }

            query = request.Handled
                ? query.OrderByDescending(s => s.RepliedAt ?? s.ClosedAt)
                : query.OrderBy(s => s.IsRead).ThenByDescending(s => s.DateReported);

            var projected = query
                .Select(s => new ContactMessageAdminListItemDTO
                {
                    Id = s.Id,
                    FirstName = s.FName,
                    LastName = s.LName,
                    Email = s.Email,
                    ReasonName = s.ReasonNavigation != null ? s.ReasonNavigation.Name : "-",
                    Message = s.Content,
                    IsRead = s.IsRead == 1,
                    CreatedAt = s.DateReported,
                    ReplyText = s.ReplyText,
                    RepliedAt = s.RepliedAt,
                    ClosedAt = s.ClosedAt,
                    IsHandled = s.RepliedAt != null || s.ClosedAt != null,
                    RepliedByEmail = s.RepliedBy != null
                        ? db.Users.Where(u => u.Id == s.RepliedBy).Select(u => u.Email).FirstOrDefault()
                        : null
                });

            return Paging.Build(projected, request.Page);
        }
    }
}
