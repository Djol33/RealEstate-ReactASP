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
            return this.db.Users.Where(perId => perId.Id == request).Select(x => new UserProfileDTO
            {
                Email = x.Email,
                UserBasic = x.UserBasics.Where(userId=> userId.FkId == x.Id).Select(a=>new UserBasicDTO
                {
                    FirstName = a.FirstName,
                    LastName = a.LastName,
                }).First(),
                UserCompany = x.Companies.Where(companyId=> companyId.FkId == x.Id).Select(Company=>new UserCompanyDTO
                {
                    BIP = Company.Bip

                }).FirstOrDefault()
                
            }).FirstOrDefault() ;
        }
    }
}
