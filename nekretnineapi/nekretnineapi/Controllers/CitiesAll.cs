using Application;
using Application.DTO.Query;
using Application.Query;
using Microsoft.AspNetCore.Mvc;

namespace nekretnineapi.Controllers
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

        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
