using Application;
using Application.Command;
using Application.DTO.Command;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using nekretnineapi.Validators;

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
            var result = new ReportRealestateValidator().Validate(body);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            executor.ExecuteCommand(service, body);
            return NoContent();
        }
    }
}
