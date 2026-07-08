using Application;
using Application.DTO.Query;
using Application.Query;
using Implementation.Query.City;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

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

        // GET: api/<City>
        [HttpGet]
        public IActionResult Get([FromQuery] CityQueryDTO query, [FromServices] ICitySearch command)
        {
            return Ok(executionContext.ExecuteQuery(command, query));
        }

        // GET api/<City>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<City>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<City>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<City>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
