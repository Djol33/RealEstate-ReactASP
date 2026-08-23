using Application;
using Application.Query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace nekretnineapi.Controllers.RealEstate
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecommendationsController : ControllerBase
    {
        private readonly UseCaseExecutor executor;

        public RecommendationsController(UseCaseExecutor executor)
        {
            this.executor = executor;
        }

        [AllowAnonymous]
        [HttpGet("trending")]
        public IActionResult Trending([FromQuery] int count, [FromServices] IShowTrending service)
            => Ok(executor.ExecuteQuery(service, count));

        [Authorize]
        [HttpGet("recently-viewed")]
        public IActionResult RecentlyViewed([FromQuery] int count, [FromServices] IShowRecentlyViewed service)
            => Ok(executor.ExecuteQuery(service, count));

        [Authorize]
        [HttpGet("for-you")]
        public IActionResult ForYou([FromQuery] int count, [FromServices] IShowRecommendations service)
            => Ok(executor.ExecuteQuery(service, count));
    }
}
