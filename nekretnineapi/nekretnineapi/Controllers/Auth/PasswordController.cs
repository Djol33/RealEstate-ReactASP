using Application;
using Application.Command;
using Application.DTO.Command;
using Application.Query;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using nekretnineapi.Validators;

namespace nekretnineapi.Controllers.Auth
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
            var dto = new RequestPasswordResetDTO
            {
                Email = (body.Email ?? "").Trim()
            };

            var result = new RequestPasswordResetValidator().Validate(dto);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            executor.ExecuteCommand(service, dto);
            return Ok(new { message = "If an account exists for that email, a reset link has been sent." });
        }

        [HttpGet("reset/check")]
        public IActionResult CheckToken([FromQuery] string token, [FromServices] ICheckResetToken service)
        {
            return Ok(new { valid = executor.ExecuteQuery(service, token ?? "") });
        }

        [HttpPost("reset")]
        public IActionResult Reset([FromBody] ResetRequest body, [FromServices] IResetPassword service)
        {
            var dto = new ResetPasswordDTO
            {
                Token = body.Token,
                NewPassword = body.NewPassword
            };

            var result = new ResetPasswordValidator().Validate(dto);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            executor.ExecuteCommand(service, dto);
            return NoContent();
        }

        public class ForgotRequest
        {
            public string Email { get; set; }
        }

        public class ResetRequest
        {
            public string Token { get; set; }
            public string NewPassword { get; set; }
        }
    }
}
