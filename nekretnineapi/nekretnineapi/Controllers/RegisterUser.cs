using Application;
using Application.Command;
using Application.Command;
using Application.DTO.Command;
using DataDomain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using nekretnineapi.Validators;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace nekretnineapi.Controllers
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
        // GET: api/<RegisterUser>
        [HttpGet]
        public IActionResult Get()
        {
            return Ok();
        }

        // GET api/<RegisterUser>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<RegisterUser>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] RegisterUserDTO param, [FromServices] IRegesiter service)
        {


            var validator = new BasicUserValidator(db);
            var result = await validator.ValidateAsync(param);
            if (!result.IsValid)
            {
                // vraćamo sve greške korisniku
                return BadRequest(result.Errors );
            }
            executor.ExecuteCommand(service, param);

            return Ok();
        }

        // PUT api/<RegisterUser>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<RegisterUser>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
