using Application;
using Application.Command;
using Application.DTO.Command;
using Application.Query;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using nekretnineapi.Services;
using nekretnineapi.Validators;

namespace nekretnineapi.Controllers.User
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly UseCaseExecutor exec;
        private readonly ImageStorageService imageStorage;

        public ProfileController(UseCaseExecutor exec, ImageStorageService imageStorage)
        {
            this.exec = exec;
            this.imageStorage = imageStorage;
        }

        [Authorize]
        [HttpGet]
        public IActionResult Get([FromServices] IUserProfile query)
        {
            var id = int.Parse(User.FindFirst("Id").Value);
            return Ok(exec.ExecuteQuery(query, id));
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public IActionResult Get(int id, [FromServices] IUserProfile query)
            => Ok(exec.ExecuteQuery(query, id));

        [AllowAnonymous]
        [HttpGet("{id}/realestates")]
        public IActionResult GetRealEstates(int id, [FromServices] IShowUserRealEstate query)
            => Ok(exec.ExecuteQuery(query, id));

        [Authorize]
        [HttpPut]
        public IActionResult Put(
            [FromBody] EditProfileDTO request,
            [FromServices] IEditProfile service)
        {
            var result = new EditProfileValidator().Validate(request);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            exec.ExecuteCommand(service, request);
            return NoContent();
        }

        [Authorize]
        [HttpPut("company")]
        [Consumes("multipart/form-data")]
        public IActionResult PutCompany(
            [FromForm] string name,
            [FromForm] string bip,
            [FromForm] IFormFile? logo,
            [FromServices] IEditCompany service)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ValidationException("Company name cannot be empty.");
            if (string.IsNullOrWhiteSpace(bip))
                throw new ValidationException("Tax ID cannot be empty.");

            var dto = new EditCompanyDTO { Name = name, BIP = bip };

            if (logo != null)
            {
                var paths = imageStorage.Save(new System.Collections.Generic.List<IFormFile> { logo });
                dto.Logo = paths.FirstOrDefault();
            }

            exec.ExecuteCommand(service, dto);
            return NoContent();
        }
    }
}
