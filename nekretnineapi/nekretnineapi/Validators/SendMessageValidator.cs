using Application.DTO.Command;
using FluentValidation;

namespace nekretnineapi.Validators
{
    public class SendMessageValidator : AbstractValidator<SendMessageDTO>
    {
        public SendMessageValidator()
        {
            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Message cannot be empty.")
                .MaximumLength(2000).WithMessage("Message cannot exceed 2000 characters.");

            RuleFor(x => x.ReceiverId)
                .GreaterThan(0).WithMessage("A recipient must be selected.");
        }
    }
}
