using DataDomain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using nekretnineapi.DTO;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace nekretnineapi.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class LoginTEST : ControllerBase
    {
        private readonly JWTManager _manager;

        private readonly IApplicationActor a;
        public LoginTEST(JWTManager _manager)
        {
            this._manager = _manager;
        }
 
        
        [HttpPost]
        public IActionResult Post([FromBody] UserLogin user)
        {
            return Ok(new { token = _manager.MakeToken(user.Email, user.Password) });
             
 
        }

        // GET api/<LoginTEST>/5
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {


            Console.WriteLine(a.Email);
            return Ok(a.ToString());
        }

        // POST api/<LoginTEST>
   

        // PUT api/<LoginTEST>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }
        [HttpGet("all")]  // ovo mora biti druga ruta
        public IActionResult GetAll()
        {
            return Ok("All users");
        }
        // DELETE api/<LoginTEST>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
