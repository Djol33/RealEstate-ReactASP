using Application;
using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;

namespace nekretnineapi.Validators
{ 
    public class BasicUserValidator : AbstractValidator<RegisterUserDTO>
    {
        private readonly AppDbContext db;
        public BasicUserValidator(AppDbContext db) {
            this.db = db;
            RuleFor(X => X.Email).NotEmpty().WithMessage("Email cannot be empty.")
                .EmailAddress().WithMessage("Please enter a valid email address.")

                
                
                ;

            RuleFor(x => x.FirstName).MinimumLength(3).WithMessage("First name must be at least 3 characters.")
                .NotEmpty().WithMessage("This field cannot be empty.")
                .MaximumLength(30).WithMessage("First name cannot exceed 30 characters.")
                .Must(PersonName.IsValid).WithMessage("First name must contain only letters.");

            RuleFor(x => x.LastName).MinimumLength(3).WithMessage("Last name must be at least 3 characters.")
                .NotEmpty().WithMessage("This field cannot be empty.")
                .MaximumLength(30).WithMessage("Last name cannot exceed 30 characters.")
                .Must(PersonName.IsValid).WithMessage("Last name must contain only letters.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password cannot be empty.")
                .Matches(@"^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$")
                .WithMessage("Password must be at least 8 characters and contain a letter, a number and a special character.");

            RuleFor(x => x.Address)
                .MaximumLength(200).WithMessage("Address cannot exceed 200 characters.");

            RuleFor(x => x.Email).MustAsync(async (Email, cancellation) =>
            {
                bool exists =   db.Users.Any(z=>z.Email ==  Email);
                return !exists;
            }).WithMessage("This email is already in use.");
        }

    }
    }
