using Application.DTO.Command;
using FluentValidation;
using FluentValidation.Results;

namespace nekretnineapi.Validators
{
    public class SubmitContactMessageValidator : AbstractValidator<SubmitContactMessageDTO>
    {
        public const string IsLoggedInKey = "IsLoggedIn";

        public SubmitContactMessageValidator()
        {
            RuleFor(x => x.ReasonId)
                .GreaterThan(0).WithMessage("Please select a valid reason.");

            RuleFor(x => x.Message)
                .NotEmpty().WithMessage("Message cannot be empty.")
                .MinimumLength(10).WithMessage("Message must be at least 10 characters.")
                .MaximumLength(2000).WithMessage("Message cannot exceed 2000 characters.");

            When(IsGuest, () =>
            {
                RuleFor(x => x.FirstName)
                    .NotEmpty().WithMessage("First name cannot be empty.");

                RuleFor(x => x.LastName)
                    .NotEmpty().WithMessage("Last name cannot be empty.");

                RuleFor(x => x.Email)
                    .NotEmpty().WithMessage("Please enter a valid email address.")
                    .Matches(@"^[^\s@]+@[^\s@]+\.[^\s@]+$").WithMessage("Please enter a valid email address.");
            });
        }

        private static bool IsGuest(SubmitContactMessageDTO instance, ValidationContext<SubmitContactMessageDTO> context)
        {
            return !(context.RootContextData.TryGetValue(IsLoggedInKey, out var value) && value is true);
        }

        public ValidationResult ValidateFor(SubmitContactMessageDTO instance, bool isLoggedIn)
        {
            var context = new ValidationContext<SubmitContactMessageDTO>(instance);
            context.RootContextData[IsLoggedInKey] = isLoggedIn;
            return Validate(context);
        }
    }
}
