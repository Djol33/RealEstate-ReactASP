namespace Application.DTO.Admin
{
    public class ContactMessageQueryDTO
    {
        public bool Handled { get; set; }
        public string Search { get; set; }
        public int? ReasonId { get; set; }
        public int Page { get; set; } = 1;
    }
}
