using Application;
using Application.Command;
using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
using nekretnineapi.Services;
using nekretnineapi.Validators;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace nekretnineapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterCompany : ControllerBase
    {
        private readonly UseCaseExecutor executor;
        private readonly ImageStorageService imageStorage;

        public readonly AppDbContext AppDbContext;
        public RegisterCompany(AppDbContext AppDbContext, UseCaseExecutor executor, ImageStorageService imageStorage) {
            this.executor= executor;
            this.AppDbContext= AppDbContext;
            this.imageStorage = imageStorage;
        }
        // GET: api/<RegisterCompany>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<RegisterCompany>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<RegisterCompany>
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Post(
            [FromForm] string email,
            [FromForm] string password,
            [FromForm] string companyName,
            [FromForm] string bip,
            [FromForm] string? address,
            [FromForm] IFormFile? logo,
            [FromServices] IRegisterCompany service)
        {
            var data = new RegisterCompanyDTO
            {
                Email = email,
                Password = password,
                Name = companyName,
                BIP = bip,
                Address = address
            };

            var validator = new CompanyUserValidation(AppDbContext);
            var res = await validator.ValidateAsync(data);

            if (!res.IsValid)
            {
                return BadRequest(res.Errors);
            }

            if (logo != null)
            {
                try
                {
                    var paths = imageStorage.Save(new List<IFormFile> { logo });
                    data.Logo = paths.FirstOrDefault();
                }
                catch (ValidationException ex)
                {
                    var errors = ex.Errors.Select(e => new ValidationFailure("logo", e.ErrorMessage)).ToList();
                    return BadRequest(errors);
                }
            }

            executor.ExecuteCommand(service, data);

            return Ok();
        }

        // PUT api/<RegisterCompany>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<RegisterCompany>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
