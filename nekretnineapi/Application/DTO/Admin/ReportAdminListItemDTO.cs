using System;

namespace Application.DTO.Admin
{
    public class ReportAdminListItemDTO
    {
        public int Id { get; set; }
        public long RealestateId { get; set; }
        public string RealestateTitle { get; set; }
        public bool RealestateStillExists { get; set; }
        public string ReportedByEmail { get; set; }
        public string Reason { get; set; }
        public string Details { get; set; }
        public int Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
