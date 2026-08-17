namespace Application.DTO.Command
{
    public class SubmitContactMessageDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int ReasonId { get; set; }
        public string Message { get; set; }
    }
}
