using Application.DTO.Query;
using Application.Query;
using DataDomain.Entities;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Implementation.Query.User
{
    public class EFUserProfile : IUserProfile
    {
        public int Id => 6;
        private readonly AppDbContext db;
        public string Name => "USER PROFILE";
        public EFUserProfile(AppDbContext db) { this.db = db; }
        public UserProfileDTO Execute(int request)
        {
            var profile = db.Users
    .Where(u => u.Id == request)
    .Select(x => new UserProfileDTO
    {
        Email = x.Email,
        UserBasic = x.UserBasics.Select(a => new UserBasicDTO
        {
            FirstName = a.FirstName,
            LastName = a.LastName,
        }).FirstOrDefault(),
        UserCompany = x.Companies.Select(c => new UserCompanyDTO
        {
            BIP = c.Bip
        }).FirstOrDefault()
    })
    .FirstOrDefault();

            if (profile == null)
                throw new Exception();   // ili KeyNotFoundException

            return profile;
        }
    }
}
