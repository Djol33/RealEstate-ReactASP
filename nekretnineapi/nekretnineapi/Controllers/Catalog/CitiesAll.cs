using Application;
using Application.DTO.Query;
using Application.Query;
using Microsoft.AspNetCore.Mvc;

namespace nekretnineapi.Controllers.Catalog
{
    [Route("api/[controller]")]
    [ApiController]
    public class CitiesAll : ControllerBase
    {

        private readonly UseCaseExecutor executionContext;

        public CitiesAll(UseCaseExecutor executionContext)
        {
            this.executionContext = executionContext;
        }

        [HttpGet]
        public IActionResult Get( [FromServices] IShowAllCities query )
        {
            return Ok(executionContext.ExecuteQuery( query,  new EmptySearch()));
        }

    }
}
