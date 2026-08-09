using Application;
using Application.Command.Admin;
using Application.DTO.Command;
using Application.Query;
using Microsoft.AspNetCore.Mvc;

namespace nekretnineapi.Controllers.Admin
{
    [Route("api/admin/contact-reasons")]
    public class AdminContactReasonsController : AdminControllerBase
    {
        public AdminContactReasonsController(UseCaseExecutor executor, IApplicationActor actor)
            : base(executor, actor) { }

        [HttpGet]
        public IActionResult List([FromServices] IListContactReasons service)
        {
            EnsureAdmin();
            return Ok(executor.ExecuteQuery(service, 0));
        }

        [HttpPost]
        public IActionResult Create([FromBody] SaveContactReasonRequest body, [FromServices] ISaveContactReason service)
        {
            EnsureAdmin();
            executor.ExecuteCommand(service, new SaveContactReasonDTO { Id = 0, Name = body.Name });
            return StatusCode(201);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] SaveContactReasonRequest body, [FromServices] ISaveContactReason service)
        {
            EnsureAdmin();
            executor.ExecuteCommand(service, new SaveContactReasonDTO { Id = id, Name = body.Name });
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id, [FromServices] IDeleteContactReason service)
        {
            EnsureAdmin();
            executor.ExecuteCommand(service, id);
            return NoContent();
        }

        public class SaveContactReasonRequest
        {
            public string Name { get; set; }
        }
    }
}
