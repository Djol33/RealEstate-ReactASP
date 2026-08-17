using Application;
using Application.Command.Admin;
using Application.DTO.Command;
using Application.Query.Admin;
using Microsoft.AspNetCore.Mvc;

namespace nekretnineapi.Controllers.Admin
{
    [Route("api/admin/hero-banner-requests")]
    public class AdminHeroBannerController : AdminControllerBase
    {
        public AdminHeroBannerController(UseCaseExecutor executor, IApplicationActor actor)
            : base(executor, actor) { }

        [HttpGet]
        public IActionResult List([FromServices] IAdminListHeroBannerRequests service)
        {
            return Ok(executor.ExecuteQuery(service, 0));
        }

        [HttpPost("{id}/approve")]
        public IActionResult Approve(int id, [FromServices] IAdminDecideHeroBanner service)
        {
            executor.ExecuteCommand(service, new AdminDecideHeroBannerDTO { RequestId = id, Approve = true });
            return NoContent();
        }

        [HttpPost("{id}/reject")]
        public IActionResult Reject(int id, [FromServices] IAdminDecideHeroBanner service)
        {
            executor.ExecuteCommand(service, new AdminDecideHeroBannerDTO { RequestId = id, Approve = false });
            return NoContent();
        }

        [HttpPost("{id}/revoke")]
        public IActionResult Revoke(int id, [FromServices] IAdminRevokeHeroBanner service)
        {
            executor.ExecuteCommand(service, id);
            return NoContent();
        }
    }
}
