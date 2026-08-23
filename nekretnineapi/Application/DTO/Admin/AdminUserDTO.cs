namespace Application.DTO.Admin
{
    public class AdminUserDTO
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string CompanyName { get; set; }
        public bool IsCompany { get; set; }
        public int UserRole { get; set; }
        public bool IsActive { get; set; }
        public int RealEstateCount { get; set; }
    }
}
