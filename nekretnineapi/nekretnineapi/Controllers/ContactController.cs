using Application;
using Application.Command;
using Application.DTO.Command;
using Application.Query;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using nekretnineapi.Validators;

namespace nekretnineapi.Controllers
{
    [AllowAnonymous]
    [Route("api/contact")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly UseCaseExecutor executor;
        private readonly IApplicationActor actor;

        public ContactController(UseCaseExecutor executor, IApplicationActor actor)
        {
            this.executor = executor;
            this.actor = actor;
        }

        [HttpGet("reasons")]
        public IActionResult Reasons([FromServices] IListContactReasons service)
            => Ok(executor.ExecuteQuery(service, 0));

        [HttpPost]
        public IActionResult Submit([FromBody] SubmitContactMessageDTO body, [FromServices] ISubmitContactMessage service)
        {
            var result = new SubmitContactMessageValidator().ValidateFor(body, actor.Id > 0);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            executor.ExecuteCommand(service, body);
            return NoContent();
        }
    }
}
