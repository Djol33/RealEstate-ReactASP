namespace Application.DTO.Admin
{
    public class AdminUserPagedDTO
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int TotalCount { get; set; }
        public List<AdminUserDTO> Data { get; set; }
    }
}
