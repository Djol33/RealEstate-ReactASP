using Application;
using Application.Command.Admin;
using Application.DTO.Command;
using Application.Query.Admin;
using Microsoft.AspNetCore.Mvc;

namespace nekretnineapi.Controllers.Admin
{
    [Route("api/admin/users")]
    public class AdminUsersController : AdminControllerBase
    {
        public AdminUsersController(UseCaseExecutor executor, IApplicationActor actor)
            : base(executor, actor) { }

        [HttpGet]
        public IActionResult List([FromServices] IAdminListUsers service)
        {
            EnsureAdmin();
            return Ok(executor.ExecuteQuery(service, 0));
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id, [FromServices] IAdminDeleteUser service)
        {
            EnsureAdmin();
            executor.ExecuteCommand(service, id);
            return NoContent();
        }

        [HttpPost("{id}/role")]
        public IActionResult SetRole(int id, [FromBody] SetRoleRequest body, [FromServices] IAdminSetRole service)
        {
            EnsureAdmin();
            executor.ExecuteCommand(service, new SetRoleDTO { UserId = id, Role = body.Role });
            return NoContent();
        }

        [HttpPut("{id}")]
        public IActionResult Edit(int id, [FromBody] EditUserRequest body, [FromServices] IAdminEditUser service)
        {
            EnsureAdmin();
            executor.ExecuteCommand(service, new AdminEditUserDTO
            {
                UserId = id,
                FirstName = body.FirstName,
                LastName = body.LastName,
                Email = body.Email,
                IsActive = body.IsActive
            });
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
            public string Email { get; set; }
            public bool IsActive { get; set; }
        }
    }
}
