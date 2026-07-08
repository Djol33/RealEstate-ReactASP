using Application;
using Application.DTO.Query;
using Application.Query;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

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

        // GET: api/<CitiesAll>
        [HttpGet]
        public IActionResult Get( [FromServices] IShowAllCities query )
        {
            return Ok(executionContext.ExecuteQuery( query,  new EmptySearch()));
        }

        // GET api/<CitiesAll>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<CitiesAll>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<CitiesAll>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<CitiesAll>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
