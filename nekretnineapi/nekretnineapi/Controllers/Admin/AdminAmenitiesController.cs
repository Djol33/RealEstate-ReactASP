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
    [Route("api/admin/amenities")]
    public class AdminAmenitiesController : AdminControllerBase
    {
        public AdminAmenitiesController(UseCaseExecutor executor, IApplicationActor actor)
            : base(executor, actor) { }

        [HttpGet]
        public IActionResult List([FromServices] IListAmenities service)
        {
            return Ok(executor.ExecuteQuery(service, EfListAmenities.IncludeInactive));
        }

        [HttpPost]
        public IActionResult Create([FromBody] SaveAmenityRequest body, [FromServices] ISaveAmenity service)
        {
            var dto = new SaveAmenityDTO
            {
                Id = 0,
                Name = body.Name,
                IsFilterable = body.IsFilterable
            };

            var result = new SaveAmenityValidator().Validate(dto);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            executor.ExecuteCommand(service, dto);
            return StatusCode(201);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] SaveAmenityRequest body, [FromServices] ISaveAmenity service)
        {
            var dto = new SaveAmenityDTO
            {
                Id = id,
                Name = body.Name,
                IsFilterable = body.IsFilterable
            };

            var result = new SaveAmenityValidator().Validate(dto);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            executor.ExecuteCommand(service, dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id, [FromServices] IDeleteAmenity service)
        {
            executor.ExecuteCommand(service, id);
            return NoContent();
        }

        [HttpPost("{id}/restore")]
        public IActionResult Restore(int id, [FromServices] IRestoreAmenity service)
        {
            executor.ExecuteCommand(service, id);
            return NoContent();
        }

        public class SaveAmenityRequest
        {
            public string Name { get; set; }
            public bool IsFilterable { get; set; }
        }
    }
}
