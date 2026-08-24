using Application;
using Application.Command.Admin;
using Application.DTO.Admin;
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
        public IActionResult List(
            [FromQuery] bool handled,
            [FromQuery] string? search,
            [FromQuery] int? reasonId,
            [FromQuery] int page,
            [FromServices] IAdminListContactMessages service)
        {
            var query = new ContactMessageQueryDTO
            {
                Handled = handled,
                Search = search,
                ReasonId = reasonId,
                Page = page < 1 ? 1 : page
            };

            return Ok(executor.ExecuteQuery(service, query));
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
            var dto = new ReplyToContactMessageDTO { MessageId = id, Reply = body.Reply ?? "" };

            var result = new ReplyToContactMessageValidator().Validate(dto);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            executor.ExecuteCommand(service, dto);
            return NoContent();
        }

        [HttpPost("{id}/close")]
        public IActionResult Close(int id, [FromServices] ICloseContactMessage service)
        {
            executor.ExecuteCommand(service, id);
            return NoContent();
        }

        public class ReplyBody
        {
            public string Reply { get; set; }
        }
    }
}
