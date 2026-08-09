using Application;
using Application.Command.Admin;
using Application.DTO.Command;
using Application.Query;
using Microsoft.AspNetCore.Mvc;

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
            EnsureAdmin();
            return Ok(executor.ExecuteQuery(service, 0));
        }

        [HttpPost]
        public IActionResult Create([FromBody] SaveAmenityRequest body, [FromServices] ISaveAmenity service)
        {
            EnsureAdmin();
            executor.ExecuteCommand(service, new SaveAmenityDTO
            {
                Id = 0,
                Name = body.Name,
                IsFilterable = body.IsFilterable
            });
            return StatusCode(201);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] SaveAmenityRequest body, [FromServices] ISaveAmenity service)
        {
            EnsureAdmin();
            executor.ExecuteCommand(service, new SaveAmenityDTO
            {
                Id = id,
                Name = body.Name,
                IsFilterable = body.IsFilterable
            });
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id, [FromServices] IDeleteAmenity service)
        {
            EnsureAdmin();
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
