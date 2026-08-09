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

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password cannot be empty.")
                .Matches(@"^(?=.*[A-Za-z])(?=.*\d)\S{8,}$")
                .WithMessage("Password must be at least 8 characters long and contain at least one letter and one number.");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Company name cannot be empty.")
                .MaximumLength(50).WithMessage("Company name cannot exceed 50 characters.");

            RuleFor(x => x.BIP)
                .NotEmpty().WithMessage("BIP number cannot be empty.")
                .MaximumLength(40).WithMessage("BIP number cannot exceed 40 characters.");

            RuleFor(x => x.BIP).MustAsync(async (BIP, cancellation) =>
            {
                bool exists = db.Companies.Any(z => z.Bip == BIP);
                return !exists;
            }).WithMessage("PIB is already in use  ");

            RuleFor(x => x.Address)
                .MaximumLength(80).WithMessage("Address cannot exceed 80 characters.");
        }
    }
    }
 

