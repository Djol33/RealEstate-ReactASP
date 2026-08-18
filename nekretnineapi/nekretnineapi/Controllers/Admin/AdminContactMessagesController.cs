using Application;
using Application.Command.Admin;
using Application.DTO.Command;
using Application.Query.Admin;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using nekretnineapi.Validators;

namespace nekretnineapi.Controllers.Admin
{
    [Route("api/admin/contact-messages")]
    public class AdminContactMessagesController : AdminControllerBase
    {
        public AdminContactMessagesController(UseCaseExecutor executor, IApplicationActor actor)
            : base(executor, actor) { }

        [HttpGet]
        public IActionResult List([FromServices] IAdminListContactMessages service)
        {
            return Ok(executor.ExecuteQuery(service, 0));
        }

        [HttpPost("{id}/read")]
        public IActionResult MarkRead(int id, [FromServices] IMarkContactMessageRead service)
        {
            executor.ExecuteCommand(service, id);
            return NoContent();
        }

        [HttpPost("{id}/reply")]
        public IActionResult Reply(int id, [FromBody] ReplyBody body, [FromServices] IReplyToContactMessage service)
        {
            var dto = new ReplyToContactMessageDTO { MessageId = id, Reply = (body.Reply ?? "").Trim() };

            var result = new ReplyToContactMessageValidator().Validate(dto);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            executor.ExecuteCommand(service, dto);
            return NoContent();
        }

        public class ReplyBody
        {
            public string Reply { get; set; }
        }
    }
}
