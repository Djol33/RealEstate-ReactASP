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
                .NotEmpty().WithMessage("Cant be empty");

            RuleFor(x => x.LastName).MinimumLength(3).WithMessage("Last Name cant be shorter than 3 caracters")
    .NotEmpty().WithMessage("Cant be empty");




            RuleFor(x => x.Email).MustAsync(async (Email, cancellation) =>
            {
                bool exists =   db.Users.Any(z=>z.Email ==  Email);
                return !exists;
            }).WithMessage("ID Must be unique");
        }

    }
    }
