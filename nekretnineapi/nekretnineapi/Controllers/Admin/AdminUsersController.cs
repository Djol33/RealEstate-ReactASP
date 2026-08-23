using Application;
using Application.Command.Admin;
using Application.DTO.Admin;
using Application.DTO.Command;
using Application.Query.Admin;
using DataDomain.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using nekretnineapi.Validators;

namespace nekretnineapi.Controllers.Admin
{
    [Route("api/admin/users")]
    public class AdminUsersController : AdminControllerBase
    {
        public AdminUsersController(UseCaseExecutor executor, IApplicationActor actor)
            : base(executor, actor) { }

        [HttpGet]
        public IActionResult List([FromQuery] string search, [FromQuery] int page, [FromServices] IAdminListUsers service)
        {
            return Ok(executor.ExecuteQuery(service, new AdminUserQueryDTO { Search = search, Page = page < 1 ? 1 : page }));
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id, [FromServices] IAdminDeleteUser service)
        {
            executor.ExecuteCommand(service, id);
            return NoContent();
        }

        [HttpPost("{id}/role")]
        public IActionResult SetRole(int id, [FromBody] SetRoleRequest body, [FromServices] IAdminSetRole service)
        {
            var dto = new SetRoleDTO { UserId = id, Role = body.Role };

            var result = new SetRoleValidator().Validate(dto);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            executor.ExecuteCommand(service, dto);
            return NoContent();
        }

        [HttpPut("{id}")]
        public IActionResult Edit(int id, [FromBody] EditUserRequest body, [FromServices] IAdminEditUser service,
            [FromServices] AppDbContext db)
        {
            var dto = new AdminEditUserDTO
            {
                UserId = id,
                FirstName = (body.FirstName ?? "").Trim(),
                LastName = (body.LastName ?? "").Trim(),
                CompanyName = (body.CompanyName ?? "").Trim(),
                Email = (body.Email ?? "").Trim(),
                IsActive = body.IsActive
            };

            var isCompany = db.Companies.Any(c => c.FkId == id);

            var result = new AdminEditUserValidator().ValidateFor(dto, isCompany);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            executor.ExecuteCommand(service, dto);
            return NoContent();
        }

        public class SetRoleRequest
        {
            public int Role { get; set; }
        }

        public class EditUserRequest
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string CompanyName { get; set; }
            public string Email { get; set; }
            public bool IsActive { get; set; }
        }
    }
}
