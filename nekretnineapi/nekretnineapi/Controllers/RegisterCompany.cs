using Application;
using Application.Command;
using Application.DTO.Command;
using DataDomain.Entities;
using Microsoft.AspNetCore.Mvc;
using nekretnineapi.Validators;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace nekretnineapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterCompany : ControllerBase
    {
        private readonly UseCaseExecutor executor;

        public readonly AppDbContext AppDbContext;
        public RegisterCompany(AppDbContext AppDbContext, UseCaseExecutor executor) {
            this.executor= executor;
            this.AppDbContext= AppDbContext;
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
        public async Task<IActionResult> Post([FromBody] RegisterCompanyDTO data, [FromServices] IRegisterCompany service )
        {


            Console.WriteLine($"EMAIL: '{data.Email}'");
            Console.WriteLine($"PASSWORD: '{data.Password}'");
            Console.WriteLine($"NAME: '{data.BIP}'");

            var validator = new CompanyUserValidation(AppDbContext);
            var res = await validator.ValidateAsync(data);

            if (!res.IsValid)
            {
 
                return BadRequest(res.Errors);
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
