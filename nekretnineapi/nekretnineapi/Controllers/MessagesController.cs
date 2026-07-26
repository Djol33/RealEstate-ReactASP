using Application;
using Application.Command;
using Application.Query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace nekretnineapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly UseCaseExecutor executor;

        public MessagesController(UseCaseExecutor executor)
        {
            this.executor = executor;
        }

        [HttpGet("conversations")]
        public IActionResult GetConversations([FromServices] IGetConversations service)
        {
            var id = int.Parse(User.FindFirst("Id").Value);
            return Ok(executor.ExecuteQuery(service, id));
        }

        [HttpGet("{otherUserId}")]
        public IActionResult GetConversation(
            int otherUserId,
            [FromServices] IGetConversation service,
            [FromServices] IMarkRead markRead)
        {
            var messages = executor.ExecuteQuery(service, otherUserId);
            executor.ExecuteCommand(markRead, otherUserId);
            return Ok(messages);
        }
    }
}
