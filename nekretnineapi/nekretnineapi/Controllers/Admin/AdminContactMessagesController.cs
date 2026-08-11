using Application;
using Application.Command.Admin;
using Application.DTO.Command;
using Application.Query.Admin;
using Microsoft.AspNetCore.Mvc;

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
            EnsureAdmin();
            return Ok(executor.ExecuteQuery(service, 0));
        }

        [HttpPost("{id}/read")]
        public IActionResult MarkRead(int id, [FromServices] IMarkContactMessageRead service)
        {
            EnsureAdmin();
            executor.ExecuteCommand(service, id);
            return NoContent();
        }

        [HttpPost("{id}/reply")]
        public IActionResult Reply(int id, [FromBody] ReplyBody body, [FromServices] IReplyToContactMessage service)
        {
            EnsureAdmin();
            executor.ExecuteCommand(service, new ReplyToContactMessageDTO { MessageId = id, Reply = body.Reply });
            return NoContent();
        }

        public class ReplyBody
        {
            public string Reply { get; set; }
        }
    }
}
