using Application;
using Application.Command;
using Application.DTO.Command;
using DataDomain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Implementation.Command
{
    public class EfRegisterUser : IRegesiter
    {

        private readonly AppDbContext db;

        int IUseCase.Id => 4;

        string IUseCase.Name => "Register User";

        public EfRegisterUser(AppDbContext db) {
            this.db = db;
            
        }

        public void  Execute(RegisterUserDTO request)
        {

            Console.WriteLine(this.db.Users == null);
            var user = new User();
            user.Email = request.Email;
            user.Password = request.Password;
            user.UserRole = 0;
            user.IsActive = 1;
            user.CreatedAt= DateTime.UtcNow;
            user.UserBasics.Add(new UserBasic
            {
                FirstName = request.FirstName,
                LastName = request.LastName
            });
            try
            {
                this.db.Users.Add(user);
                this.db.SaveChanges();
            }catch(DbUpdateException e)
            {
                if (e.InnerException is Microsoft.Data.SqlClient.SqlException sqlEx)
                {
                    // 2627 i 2601 su SQL Server kodovi za UNIQUE constraint violation
                    if (sqlEx.Number == 2627 || sqlEx.Number == 2601)
                    {
                        throw new ApplicationException("Email već postoji.");
                    }
                }


            }



        }
    }
}
