using Application;
using Application.Command;
using Application.DTO.Command;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace nekretnineapi.Controllers
{
    [Authorize]
    [Route("api/reports")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly UseCaseExecutor executor;

        public ReportController(UseCaseExecutor executor)
        {
            this.executor = executor;
        }

        [HttpPost]
        public IActionResult Report([FromBody] ReportRealestateDTO body, [FromServices] IReportRealestate service)
        {
            executor.ExecuteCommand(service, body);
            return NoContent();
        }
    }
}
