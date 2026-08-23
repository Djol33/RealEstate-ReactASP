using Application;
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
            RuleFor(X => X.Email).NotEmpty().WithMessage("Email cannot be empty.")
                        .EmailAddress().WithMessage("Please enter a valid email address.");



            RuleFor(x => x.Email).MustAsync(async (Email, cancellation) =>
            {
                bool exists = db.Users.Any(z => z.Email == Email);
                return !exists;
            }).WithMessage("This email is already in use.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password cannot be empty.")
                .Matches(@"^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$")
                .WithMessage("Password must be at least 8 characters and contain a letter, a number and a special character.");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Company name cannot be empty.")
                .MaximumLength(50).WithMessage("Company name cannot exceed 50 characters.");

            RuleFor(x => x.BIP)
                .NotEmpty().WithMessage("Tax ID (PIB) cannot be empty.")
                .Must(Pib.IsValid).WithMessage("Tax ID (PIB) must be 9 digits and a valid Serbian PIB.");

            RuleFor(x => x.BIP).MustAsync(async (BIP, cancellation) =>
            {
                bool exists = db.Companies.Any(z => z.Bip == BIP);
                return !exists;
            }).WithMessage("This tax ID (PIB) is already in use.");

            RuleFor(x => x.Address)
                .MaximumLength(40).WithMessage("Address cannot exceed 40 characters.");
        }
    }
    }
 

