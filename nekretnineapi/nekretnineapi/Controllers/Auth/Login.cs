using Application;
using Application.Command;
using Application.DTO.Command;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace nekretnineapi.Controllers.Auth
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class Login : ControllerBase
    {
        private readonly UseCaseExecutor executor;

        public Login(UseCaseExecutor executor)
        {
            this.executor = executor;
        }

        [HttpPost]
        public IActionResult Post([FromBody] LoginDTO request, [FromServices] ILogin login)
        {
            var result = executor.ExecuteQuery(login, request);
            return Ok(result);
        }
    }
}
