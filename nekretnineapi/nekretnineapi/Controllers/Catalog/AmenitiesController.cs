using Application;
using Application.Query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace nekretnineapi.Controllers.Catalog
{
    [AllowAnonymous]
    [Route("api/amenities")]
    [ApiController]
    public class AmenitiesController : ControllerBase
    {
        private readonly UseCaseExecutor executor;

        public AmenitiesController(UseCaseExecutor executor)
        {
            this.executor = executor;
        }

        [HttpGet]
        public IActionResult List([FromServices] IListAmenities service)
            => Ok(executor.ExecuteQuery(service, 0));
    }
}
