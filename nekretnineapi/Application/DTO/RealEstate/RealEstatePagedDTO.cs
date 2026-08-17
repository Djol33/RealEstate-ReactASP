namespace Application.DTO
{
    public class RealEstatePagedDTO
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int TotalCount { get; set; }
        public List<RealEstateDTO> Data { get; set; }
    }
}
