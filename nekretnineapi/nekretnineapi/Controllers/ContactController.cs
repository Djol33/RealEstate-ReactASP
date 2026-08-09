using Application;
using Application.Command;
using Application.DTO.Command;
using Application.Query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace nekretnineapi.Controllers
{
    [AllowAnonymous]
    [Route("api/contact")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly UseCaseExecutor executor;

        public ContactController(UseCaseExecutor executor)
        {
            this.executor = executor;
        }

        [HttpGet("reasons")]
        public IActionResult Reasons([FromServices] IListContactReasons service)
            => Ok(executor.ExecuteQuery(service, 0));

        [HttpPost]
        public IActionResult Submit([FromBody] SubmitContactMessageDTO body, [FromServices] ISubmitContactMessage service)
        {
            executor.ExecuteCommand(service, body);
            return NoContent();
        }
    }
}
