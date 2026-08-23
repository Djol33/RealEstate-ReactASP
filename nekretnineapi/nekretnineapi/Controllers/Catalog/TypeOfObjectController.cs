using Application;
using Application.Command;
using Application.DTO.Query;
using Application.DTO.Query.TypeOfRealestate;
using Application.Query;
using DataDomain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace nekretnineapi.Controllers.Catalog
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

    }
}
