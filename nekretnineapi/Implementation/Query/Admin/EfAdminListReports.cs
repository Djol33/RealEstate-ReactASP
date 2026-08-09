using Application;
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

        public List<ReportAdminListItemDTO> Execute(int request)
        {
            return db.RealestateReports
                .OrderBy(r => r.Status == ReportStatus.Pending ? 0 : 1)
                .ThenByDescending(r => r.CreatedAt)
                .Select(r => new ReportAdminListItemDTO
                {
                    Id = r.Id,
                    RealestateId = r.RealestateId,
                    RealestateTitle = db.Realestates.Where(x => x.Id == r.RealestateId).Select(x => x.Title).FirstOrDefault(),
                    RealestateStillExists = db.Realestates.Any(x => x.Id == r.RealestateId),
                    ReportedByEmail = db.Users.Where(u => u.Id == r.ReportedBy).Select(u => u.Email).FirstOrDefault(),
                    Reason = r.Reason,
                    Details = r.Details,
                    Status = r.Status,
                    CreatedAt = r.CreatedAt
                })
                .ToList();
        }
    }
}
