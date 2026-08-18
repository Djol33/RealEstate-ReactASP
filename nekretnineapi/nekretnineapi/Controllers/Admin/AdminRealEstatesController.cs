using Application;
using Application.DTO.Query;
using Application.Query;
using Microsoft.AspNetCore.Mvc;

namespace nekretnineapi.Controllers.Admin
{
    [Route("api/admin/realestates")]
    public class AdminRealEstatesController : AdminControllerBase
    {
        public AdminRealEstatesController(UseCaseExecutor executor, IApplicationActor actor)
            : base(executor, actor) { }

        [HttpGet]
        public IActionResult List([FromQuery] int page, [FromQuery] string? search, [FromServices] IShowRealEstate service)
        {

            var query = new RealEstateQueryDTO
            {
                Page = page < 1 ? 1 : page,
                Search = search,
                IncludeInactive = true
            };

            return Ok(executor.ExecuteQuery(service, query));
        }
    }
}
