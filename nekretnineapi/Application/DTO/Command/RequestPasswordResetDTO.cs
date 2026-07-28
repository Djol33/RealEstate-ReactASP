namespace Application.DTO.Command
{
    public class RequestPasswordResetDTO
    {
        public string Email { get; set; }
        public string ResetUrlBase { get; set; }
    }
}
