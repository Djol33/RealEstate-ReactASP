using Application;
using Application.Query.Admin;
using Microsoft.AspNetCore.Mvc;

namespace nekretnineapi.Controllers.Admin
{
    [Route("api/admin/stats")]
    public class AdminStatsController : AdminControllerBase
    {
        public AdminStatsController(UseCaseExecutor executor, IApplicationActor actor)
            : base(executor, actor) { }

        [HttpGet]
        public IActionResult Get([FromServices] IAdminStats service)
        {
            return Ok(executor.ExecuteQuery(service, 0));
        }
    }
}
