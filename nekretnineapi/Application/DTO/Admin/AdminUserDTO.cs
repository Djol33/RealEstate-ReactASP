namespace Application.DTO.Admin
{
    public class AdminUserDTO
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int UserRole { get; set; }
        public bool IsActive { get; set; }
        public int RealEstateCount { get; set; }
    }
}
