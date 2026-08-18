using Application;
using Application.DTO.Command;
using FluentValidation;

namespace nekretnineapi.Validators
{
    public class ReportRealestateValidator : AbstractValidator<ReportRealestateDTO>
    {
        public ReportRealestateValidator()
        {
            RuleFor(x => x.RealestateId)
                .GreaterThan(0).WithMessage("A listing must be selected.");

            RuleFor(x => x.Reason)
                .Must(ReportReason.IsValid).WithMessage("Please select a valid reason.");

            RuleFor(x => x.Details)
                .MaximumLength(1000).WithMessage("Details cannot exceed 1000 characters.")
                .When(x => x.Details != null);
        }
    }
}
