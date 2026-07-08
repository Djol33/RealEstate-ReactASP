using DataDomain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using nekretnineapi.DTO;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace nekretnineapi
{
    public class JWTManager
    {
        public readonly AppDbContext db;

        public JWTManager(AppDbContext db)
        {
            this.db = db;
        }

        public object MakeToken(string Email, string Password)
        {
            var user = this.db.Users
                .Include(u => u.UserBasics)
                .Include(u => u.Companies)
                .Where(u => u.Email == Email && u.Password == Password)
                .Select(x => new
                {
                    x.Id,
                    x.Email,
                    x.UserRole,
                    FirstName = x.UserBasics.Where(b => b.FkId == x.Id).Select(b => b.FirstName).FirstOrDefault(),
                    LastName = x.UserBasics.Where(b => b.FkId == x.Id).Select(b => b.LastName).FirstOrDefault(),
                    Company = x.Companies.Where(c => c.FkId == x.Id).Select(c => c.Name).FirstOrDefault(),
                })
                .FirstOrDefault();

            if (user == null)
            {
                return new { Code = 401, Error = "There is no user with given informations" };
            }

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("Email", user.Email),
                new Claim("Id", user.Id.ToString()),
                new Claim("UserRole", user.UserRole.ToString()),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("your_super_secret_key_ndsfknfdsklndfsklndfsklndfskongskondfskodvnkodfvnkdfosnkodfsodvnkl/dfs"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: "yourdomain.com",
                audience: "yourdomain.com",
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            if (user.FirstName != null)
                return new { token = tokenString, user.Id, user.Email, user.FirstName, user.LastName };

            return new { token = tokenString, user.Id, user.Email, user.Company };
        }
    }
}
