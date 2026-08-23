using Application;
using Application.DTO.Query;
using Application.Query;
using Implementation.Query.City;
using Microsoft.AspNetCore.Mvc;

namespace nekretnineapi.Controllers.Catalog
{
    [Route("api/[controller]")]
    [ApiController]
    public class City : ControllerBase
    {

        private readonly UseCaseExecutor executionContext;

        public City(UseCaseExecutor executionContext) {
        this.executionContext = executionContext;
        }

        [HttpGet]
        public IActionResult Get([FromQuery] CityQueryDTO query, [FromServices] ICitySearch command)
        {
            return Ok(executionContext.ExecuteQuery(command, query));
        }

    }
}
