using Application;
using Application.Command;
using Application.DTO;
using Application.DTO.Command;
using Application.Exceptions;
using Application.Security;
using DataDomain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Implementation.Command
{
    public class EfLogin : ILogin
    {
        public int Id => 1;
        public string Name => "Login";

        private readonly AppDbContext db;
        private readonly ITokenFactory tokenFactory;
        private readonly IPasswordHasher passwordHasher;

        public EfLogin(AppDbContext db, ITokenFactory tokenFactory, IPasswordHasher passwordHasher)
        {
            this.db = db;
            this.tokenFactory = tokenFactory;
            this.passwordHasher = passwordHasher;
        }

        public LoginResultDTO Execute(LoginDTO request)
        {
            var user = db.Users
                .Include(u => u.UserBasics)
                .Include(u => u.Companies)
                .Where(u => u.Email == request.Email)
                .Select(x => new
                {
                    x.Id,
                    x.Email,
                    x.Password,
                    x.UserRole,
                    FirstName = x.UserBasics.Select(b => b.FirstName).FirstOrDefault(),
                    LastName = x.UserBasics.Select(b => b.LastName).FirstOrDefault(),
                    Company = x.Companies.Select(c => c.Name).FirstOrDefault(),
                })
                .FirstOrDefault();

            if (user == null || !passwordHasher.Verify(request.Password, user.Password))
                throw new InvalidCredentialsException();

            var token = tokenFactory.Create(user.Id, user.Email, user.UserRole);

            return new LoginResultDTO
            {
                Token = token,
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Company = user.Company
            };
        }
    }
}
