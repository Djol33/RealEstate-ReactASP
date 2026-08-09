using Application;
using Application.Command;
using Application.DTO.HeroBanner;
using Application.Query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace nekretnineapi.Controllers
{
    [Route("api/hero-banner")]
    [ApiController]
    public class HeroBannerController : ControllerBase
    {
        private readonly UseCaseExecutor executor;

        public HeroBannerController(UseCaseExecutor executor)
        {
            this.executor = executor;
        }

        [AllowAnonymous]
        [HttpGet("active")]
        public IActionResult Active([FromServices] IGetActiveHeroBanners service)
            => Ok(executor.ExecuteQuery(service, 0));

        [AllowAnonymous]
        [HttpGet("quote")]
        public IActionResult Quote([FromServices] IGetHeroBannerQuote service)
            => Ok(executor.ExecuteQuery(service, 0));

        [Authorize]
        [HttpPost("request")]
        public IActionResult RequestBanner([FromBody] HeroBannerRequestDTO body, [FromServices] IRequestHeroBanner service)
        {
            executor.ExecuteCommand(service, body);
            return NoContent();
        }

        [Authorize]
        [HttpGet("my-requests")]
        public IActionResult MyRequests([FromServices] IGetMyHeroBannerRequests service)
            => Ok(executor.ExecuteQuery(service, 0));
    }
}
