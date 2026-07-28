using Application;
using Application.Command;
using Application.DTO.Command;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace nekretnineapi.Controllers
{
    [AllowAnonymous]
    [Route("api/password")]
    [ApiController]
    public class PasswordController : ControllerBase
    {
        private readonly UseCaseExecutor executor;

        public PasswordController(UseCaseExecutor executor)
        {
            this.executor = executor;
        }

        [HttpPost("forgot")]
        public IActionResult Forgot([FromBody] ForgotRequest body, [FromServices] IRequestPasswordReset service)
        {
            executor.ExecuteCommand(service, new RequestPasswordResetDTO
            {
                Email = body.Email,
                ResetUrlBase = body.ResetUrlBase
            });
            return Ok(new { message = "If an account exists for that email, a reset link has been sent." });
        }

        [HttpPost("reset")]
        public IActionResult Reset([FromBody] ResetRequest body, [FromServices] IResetPassword service)
        {
            executor.ExecuteCommand(service, new ResetPasswordDTO
            {
                Token = body.Token,
                NewPassword = body.NewPassword
            });
            return NoContent();
        }

        public class ForgotRequest
        {
            public string Email { get; set; }
            public string ResetUrlBase { get; set; }
        }

        public class ResetRequest
        {
            public string Token { get; set; }
            public string NewPassword { get; set; }
        }
    }
}
