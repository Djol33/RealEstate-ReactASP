using Application.Command;
using Application.DTO.Command;
using Application.Security;
using DataDomain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Implementation.Command
{
    public class EfRegisterCompany : IRegisterCompany
    {
        public EfRegisterCompany(AppDbContext db, IPasswordHasher passwordHasher)
        {
            this.db = db;
            this.passwordHasher = passwordHasher;
        }

        private readonly AppDbContext db;
        private readonly IPasswordHasher passwordHasher;
        public int Id => 5;

        public string Name => "Register Company";

        public void Execute(RegisterCompanyDTO request)
        {

            var user = new User();
            user.Email = request.Email;
            user.Password = passwordHasher.Hash(request.Password);
            user.UserRole = 0;
            user.IsActive = 1;
            user.CreatedAt = DateTime.UtcNow;
            
            user.Companies.Add(new Company
            {
                Name = request.Name,
                Bip = request.BIP,
                Location = request.Address ?? string.Empty,
                Logo = request.Logo ?? string.Empty
            });
            try
            {
                this.db.Users.Add(user);
                this.db.SaveChanges();
            }
            catch (DbUpdateException e)
            {
                if (e.InnerException is Microsoft.Data.SqlClient.SqlException sqlEx &&
                    (sqlEx.Number == 2627 || sqlEx.Number == 2601))
                {
                    if (sqlEx.Message.Contains("UX_company_bip"))
                        throw new ApplicationException("A company with this BIP is already registered.");

                    throw new ApplicationException("Email already exists.");
                }

                throw;
            }
        }
    }
}
