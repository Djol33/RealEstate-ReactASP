using Application;
using Application.Command.Admin;
using Application.DTO.Command;
using Application.Query.Admin;
using Microsoft.AspNetCore.Mvc;

namespace nekretnineapi.Controllers.Admin
{
    [Route("api/admin/reports")]
    public class AdminReportsController : AdminControllerBase
    {
        public AdminReportsController(UseCaseExecutor executor, IApplicationActor actor)
            : base(executor, actor) { }

        [HttpGet]
        public IActionResult List([FromServices] IAdminListReports service)
        {
            return Ok(executor.ExecuteQuery(service, 0));
        }

        [HttpPost("{id}/dismiss")]
        public IActionResult Dismiss(int id, [FromServices] IAdminDecideReport service)
        {
            executor.ExecuteCommand(service, new AdminDecideReportDTO { ReportId = id, DeleteListing = false });
            return NoContent();
        }

        [HttpPost("{id}/delete-listing")]
        public IActionResult DeleteListing(int id, [FromServices] IAdminDecideReport service)
        {
            executor.ExecuteCommand(service, new AdminDecideReportDTO { ReportId = id, DeleteListing = true });
            return NoContent();
        }
    }
}
