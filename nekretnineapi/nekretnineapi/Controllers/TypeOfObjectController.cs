using Application;
using Application.Command;
using Application.DTO.Query;
using Application.DTO.Query.TypeOfRealestate;
using Application.Query;
using DataDomain.Entities;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace nekretnineapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypeOfObjectController : ControllerBase
    {
        private readonly UseCaseExecutor executor;
        private readonly AppDbContext db;

        public TypeOfObjectController(UseCaseExecutor executor, AppDbContext db)
        {
            this.db = db;
            this.executor = executor;
        }
        [HttpGet]
        public IActionResult Get([FromServices] IShowTypeOfRealestate service)
        {
            return Ok(executor.ExecuteQuery<EmptySearch, List<TypeRealEstateDTO>>(service, new EmptySearch()));
        }

        // GET api/<TypeOfObjectController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<TypeOfObjectController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<TypeOfObjectController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<TypeOfObjectController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
