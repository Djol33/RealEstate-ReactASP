using System.Net;
using System.Net.Mail;
using Application.Email;
using Application.Exceptions;

namespace nekretnineapi.Services
{
    public class EmailSettings
    {
        public const string SectionName = "Email";

        public string Host { get; set; }
        public int Port { get; set; } = 587;
        public string User { get; set; }
        public string Password { get; set; }
        public string FromAddress { get; set; }
        public string FromName { get; set; } = "Nekretnine";
        public bool UseSsl { get; set; } = true;
    }

    public class SmtpEmailSender : IEmailSender
    {
        private readonly EmailSettings settings;
        private readonly ILogger<SmtpEmailSender> logger;

        public SmtpEmailSender(EmailSettings settings, ILogger<SmtpEmailSender> logger)
        {
            this.settings = settings;
            this.logger = logger;
        }

        public void Send(string toEmail, string subject, string htmlBody)
        {
            if (string.IsNullOrWhiteSpace(settings.Host) || string.IsNullOrWhiteSpace(settings.FromAddress))
            {
                logger.LogWarning(
                    "SMTP is not configured. Email not sent. Below is the message that would have been delivered.\n" +
                    "To: {To}\nSubject: {Subject}\n{Body}",
                    toEmail, subject, htmlBody);
                return;
            }

            using var message = new MailMessage
            {
                From = new MailAddress(settings.FromAddress, settings.FromName),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };
            message.To.Add(toEmail);

            using var client = new SmtpClient(settings.Host, settings.Port)
            {
                EnableSsl = settings.UseSsl,
                Credentials = new NetworkCredential(settings.User, settings.Password)
            };

            try
            {
                client.Send(message);
            }
            catch (SmtpException ex)
            {
                logger.LogError(ex, "Failed to send email to {To} via {Host}:{Port}", toEmail, settings.Host, settings.Port);
                throw new EmailDeliveryException("Failed to send email. Please try again later.", ex);
            }
        }
    }
}
