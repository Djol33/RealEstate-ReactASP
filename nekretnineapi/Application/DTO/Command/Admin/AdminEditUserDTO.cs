namespace Application.DTO.Command
{
    public class AdminEditUserDTO
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string CompanyName { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
    }
}
