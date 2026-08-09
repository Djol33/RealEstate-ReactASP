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
            RuleFor(X => X.Email).NotEmpty().WithMessage("Email Can't be Empty")
                .EmailAddress().WithMessage("It\'s not a proper email")

                
                
                ;

            RuleFor(x => x.FirstName).MinimumLength(3).WithMessage("First Name cant be shorter than 3 caracters")
                .NotEmpty().WithMessage("Cant be empty")
                .MaximumLength(30).WithMessage("First name cannot exceed 30 characters.");

            RuleFor(x => x.LastName).MinimumLength(3).WithMessage("Last Name cant be shorter than 3 caracters")
                .NotEmpty().WithMessage("Cant be empty")
                .MaximumLength(30).WithMessage("Last name cannot exceed 30 characters.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password cannot be empty.")
                .Matches(@"^(?=.*[A-Za-z])(?=.*\d)\S{8,}$")
                .WithMessage("Password must be at least 8 characters long and contain at least one letter and one number.");

            RuleFor(x => x.Address)
                .MaximumLength(200).WithMessage("Address cannot exceed 200 characters.");

            RuleFor(x => x.Email).MustAsync(async (Email, cancellation) =>
            {
                bool exists =   db.Users.Any(z=>z.Email ==  Email);
                return !exists;
            }).WithMessage("Email Must be unique");
        }

    }
    }
