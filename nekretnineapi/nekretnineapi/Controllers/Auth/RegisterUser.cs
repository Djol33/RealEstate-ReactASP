using Application;
using Application.Command;
using Application.DTO.Command;
using DataDomain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using nekretnineapi.Validators;
namespace nekretnineapi.Controllers.Auth
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterUser : ControllerBase
    {

        private readonly UseCaseExecutor executor;
        private readonly AppDbContext db;
        public RegisterUser(UseCaseExecutor executor, AppDbContext db)
        {
            this.db = db;
            this.executor = executor;
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] RegisterUserDTO param, [FromServices] IRegesiter service)
        {

            var validator = new BasicUserValidator(db);
            var result = await validator.ValidateAsync(param);
            if (!result.IsValid)
            {
                return BadRequest(result.Errors );
            }
            executor.ExecuteCommand(service, param);

            return Ok();
        }

    }
}
