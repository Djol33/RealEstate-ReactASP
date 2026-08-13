using Application;
using Application.Command;
using Application.DTO.Query;
using Application.DTO.Query.TypeOfRealestate;
using Application.Query;
using DataDomain.Entities;
using Microsoft.AspNetCore.Mvc;

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
