using Application;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace nekretnineapi.Controllers.Admin
{
    [ApiController]
    [Authorize]
    public abstract class AdminControllerBase : ControllerBase
    {
        protected readonly UseCaseExecutor executor;
        protected readonly IApplicationActor actor;

        protected AdminControllerBase(UseCaseExecutor executor, IApplicationActor actor)
        {
            this.executor = executor;
            this.actor = actor;
        }

        protected void EnsureAdmin()
        {
            if (actor.UserRole != UserRoles.Admin)
                throw new UnauthorizedAccessException("Access allowed to administrators only.");
        }
    }
}
