using Application;
using Application.Command;
using Application.DTO.HeroBanner;
using Application.Query;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using nekretnineapi.Validators;

namespace nekretnineapi.Controllers.Contact
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
            var result = new HeroBannerRequestValidator().Validate(body);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            executor.ExecuteCommand(service, body);
            return NoContent();
        }

        [Authorize]
        [HttpGet("my-requests")]
        public IActionResult MyRequests([FromQuery] int page, [FromServices] IGetMyHeroBannerRequests service)
            => Ok(executor.ExecuteQuery(service, page));
    }
}
