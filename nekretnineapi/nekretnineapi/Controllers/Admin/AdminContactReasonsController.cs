using Application;
using Application.Command.Admin;
using Application.DTO.Command;
using Application.Query;
using FluentValidation;
using Implementation.Query;
using Microsoft.AspNetCore.Mvc;
using nekretnineapi.Validators;

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
            return Ok(executor.ExecuteQuery(service, EfListContactReasons.IncludeInactive));
        }

        [HttpPost]
        public IActionResult Create([FromBody] SaveContactReasonRequest body, [FromServices] ISaveContactReason service)
        {
            var dto = new SaveContactReasonDTO { Id = 0, Name = (body.Name ?? "").Trim() };

            var result = new SaveContactReasonValidator().Validate(dto);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            executor.ExecuteCommand(service, dto);
            return StatusCode(201);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] SaveContactReasonRequest body, [FromServices] ISaveContactReason service)
        {
            var dto = new SaveContactReasonDTO { Id = id, Name = (body.Name ?? "").Trim() };

            var result = new SaveContactReasonValidator().Validate(dto);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            executor.ExecuteCommand(service, dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id, [FromServices] IDeleteContactReason service)
        {
            executor.ExecuteCommand(service, id);
            return NoContent();
        }

        [HttpPost("{id}/restore")]
        public IActionResult Restore(int id, [FromServices] IRestoreContactReason service)
        {
            executor.ExecuteCommand(service, id);
            return NoContent();
        }

        public class SaveContactReasonRequest
        {
            public string Name { get; set; }
        }
    }
}
