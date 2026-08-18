using Application.DTO.HeroBanner;
using FluentValidation;

namespace nekretnineapi.Validators
{
    public class HeroBannerRequestValidator : AbstractValidator<HeroBannerRequestDTO>
    {
        public HeroBannerRequestValidator()
        {
            RuleFor(x => x.RealestateId)
                .GreaterThan(0).WithMessage("A listing must be selected.");

            RuleFor(x => x.Days)
                .InclusiveBetween(1, 90).WithMessage("Days must be between 1 and 90.");
        }
    }
}
