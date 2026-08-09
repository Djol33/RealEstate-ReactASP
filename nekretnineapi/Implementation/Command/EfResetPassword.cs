using Application.Command;
using Application.DTO.Command;
using Application.Security;
using DataDomain.Entities;
using FluentValidation;

namespace Implementation.Command
{
    public class EfResetPassword : IResetPassword
    {
        public int Id => 31;
        public string Name => "Reset Password";

        private readonly AppDbContext db;
        private readonly IPasswordHasher passwordHasher;

        public EfResetPassword(AppDbContext db, IPasswordHasher passwordHasher)
        {
            this.db = db;
            this.passwordHasher = passwordHasher;
        }

        public void Execute(ResetPasswordDTO request)
        {
            var tokenHash = EfRequestPasswordReset.Hash(request.Token.Trim());

            var token = db.PasswordResetTokens
                .Where(t => t.TokenHash == tokenHash && t.UsedAt == null && t.ExpiresAt > DateTime.Now)
                .OrderByDescending(t => t.Id)
                .FirstOrDefault()
                ?? throw Fail("token", "This reset link is invalid or has expired.");

            var user = db.Users.FirstOrDefault(u => u.Id == token.UserId)
                ?? throw Fail("token", "This reset link is invalid or has expired.");

            user.Password = passwordHasher.Hash(request.NewPassword);
            token.UsedAt = DateTime.Now;
            db.SaveChanges();
        }

        private static ValidationException Fail(string property, string message)
            => new ValidationException(new[] { new FluentValidation.Results.ValidationFailure(property, message) });
    }
}
