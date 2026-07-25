using Application;
using Application.Query;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace nekretnineapi.Controllers.User
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly UseCaseExecutor exec;

        public ProfileController(UseCaseExecutor exec)
        {
            this.exec = exec;
        }
        // GET: api/<ProfileController>

        // GET api/<ProfileController>/5
        [Authorize]
        [HttpGet()]
        public IActionResult Get( [FromServices] IUserProfile query)
        {

            var id = int.Parse(User.FindFirst("Id").Value);
            return Ok(exec.ExecuteQuery(query, id));
        }

        // POST api/<ProfileController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<ProfileController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ProfileController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
