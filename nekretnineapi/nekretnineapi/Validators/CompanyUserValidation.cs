using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;

namespace nekretnineapi.Validators
{
    public class CompanyUserValidation : AbstractValidator<RegisterCompanyDTO>
    {
        private readonly AppDbContext db;

        public CompanyUserValidation(AppDbContext db) {
            this.db = db;
            RuleFor(X => X.Email).NotEmpty().WithMessage("Email Can't be Empty")
                        .EmailAddress().WithMessage("It\'s not a proper email");



            RuleFor(x => x.Email).MustAsync(async (Email, cancellation) =>
            {
                bool exists = db.Users.Any(z => z.Email == Email);
                return !exists;
            }).WithMessage("Email is already in use");

            RuleFor(x => x.BIP).MustAsync(async (BIP, cancellation) =>
            {
                bool exists = db.Companies.Any(z => z.Bip == BIP);
                return !exists;
            }).WithMessage("PIB is already in use  ");
        }
    }
    }
 

