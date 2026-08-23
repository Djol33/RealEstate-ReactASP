using Application;
using Application.Command;
using Application.DTO.Command;
using Application.DTO.Query;
using Application.Query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace nekretnineapi.Controllers.RealEstate
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        private readonly UseCaseExecutor executor;

        public WishlistController(UseCaseExecutor executor)
        {
            this.executor = executor;
        }

        [Authorize]
        [HttpGet]
        public IActionResult Get([FromQuery] int page, [FromServices] IShowWishlist service)
        {
            var id = int.Parse(User.FindFirst("Id").Value);
            return Ok(executor.ExecuteQuery(service, new UserListingsQueryDTO { UserId = id, Page = page }));
        }

        [Authorize]
        [HttpPost("{realestateId}")]
        public IActionResult Toggle(long realestateId, [FromServices] IToggleWishlist service)
        {
            executor.ExecuteCommand(service, new WishlistToggleDTO { RealestateId = realestateId });
            return NoContent();
        }
    }
}
