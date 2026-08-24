using Application;
using Application.DTO;
using Application.DTO.Admin;
using Application.Query.Admin;
using DataDomain.Entities;

namespace Implementation.Query.Admin
{
    public class EfAdminListReports : IAdminListReports
    {
        public int Id => 39;
        public string Name => "Admin List Reports";

        private readonly AppDbContext db;

        public EfAdminListReports(AppDbContext db)
        {
            this.db = db;
        }

        public PagedResult<ReportAdminListItemDTO> Execute(int request)
        {
            var page = request < 1 ? 1 : request;

            var ordered = db.RealestateReports
                .OrderBy(r => r.Status == ReportStatus.Pending ? 0 : 1)
                .ThenByDescending(r => r.CreatedAt);

            var totalCount = ordered.Count();
            var totalPages = totalCount == 0 ? 1 : (int)Math.Ceiling(totalCount / (double)Paging.DefaultPageSize);
            if (page > totalPages) page = totalPages;

            var reports = ordered
                .Skip((page - 1) * Paging.DefaultPageSize)
                .Take(Paging.DefaultPageSize)
                .ToList();

            var realestateIds = reports.Select(r => r.RealestateId).Distinct().ToList();
            var userIds = reports.Select(r => r.ReportedBy).Distinct().ToList();

            var titlesById = db.Realestates
                .Where(x => realestateIds.Contains(x.Id) && x.IsActive == 1)
                .Select(x => new { x.Id, x.Title })
                .ToDictionary(x => x.Id, x => x.Title);

            var emailsByUserId = db.Users
                .Where(u => userIds.Contains(u.Id))
                .Select(u => new { u.Id, u.Email })
                .ToDictionary(x => x.Id, x => x.Email);

            var items = reports.Select(r => new ReportAdminListItemDTO
            {
                Id = r.Id,
                RealestateId = r.RealestateId,
                RealestateTitle = titlesById.GetValueOrDefault(r.RealestateId),
                RealestateStillExists = titlesById.ContainsKey(r.RealestateId),
                ReportedByEmail = emailsByUserId.GetValueOrDefault(r.ReportedBy),
                Reason = r.Reason,
                Details = r.Details,
                Status = r.Status,
                CreatedAt = r.CreatedAt
            }).ToList();

            return new PagedResult<ReportAdminListItemDTO>
            {
                CurrentPage = page,
                TotalPages = totalPages,
                TotalCount = totalCount,
                Data = items
            };
        }
    }
}
