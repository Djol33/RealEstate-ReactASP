namespace Application.DTO.Query
{
    public class RealEstateQueryDTO
    {
        public string? City { get; set; }
        public int? MinPrice { get; set; }
        public int? MaxPrice { get; set; }
        public int? TypeObject { get; set; }
        public string? Title { get; set; }
        public float? MinRooms { get; set; }
        public int Page { get; set; } = 1;
    }
}
