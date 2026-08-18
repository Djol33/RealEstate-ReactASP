using Application.DTO.Command;
using FluentValidation;

namespace nekretnineapi.Validators
{
    public class ReplyToContactMessageValidator : AbstractValidator<ReplyToContactMessageDTO>
    {
        public ReplyToContactMessageValidator()
        {
            RuleFor(x => x.Reply)
                .NotEmpty().WithMessage("Reply cannot be empty.")
                .MaximumLength(2000).WithMessage("Reply cannot exceed 2000 characters.");
        }
    }
}
