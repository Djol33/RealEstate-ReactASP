using Application;
using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;

namespace nekretnineapi.Validators
{
    public class SendMessageValidator : AbstractValidator<SendMessageDTO>
    {
        public SendMessageValidator(AppDbContext db, IApplicationActor actor)
        {
            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Message cannot be empty.")
                .MaximumLength(2000).WithMessage("Message cannot exceed 2000 characters.");

            RuleFor(x => x.ReceiverId)
                .GreaterThan(0).WithMessage("A recipient must be selected.")
                .Must(id => id != actor.Id).WithMessage("You cannot send a message to yourself.")
                .Must(id => db.Users.Any(u => u.Id == id && u.IsActive == 1))
                .WithMessage("Recipient does not exist.");
        }
    }
}
