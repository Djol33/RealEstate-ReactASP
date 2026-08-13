using Application;
using Application.DTO.Query;
using Application.Query;
using Implementation.Query.City;
using Microsoft.AspNetCore.Mvc;

namespace nekretnineapi.Controllers
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
