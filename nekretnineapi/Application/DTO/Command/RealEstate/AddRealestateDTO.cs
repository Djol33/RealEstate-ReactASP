namespace Application.DTO.Command
{
    public class AddRealestateDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int CityId { get; set; }
        public int TypeObjectId { get; set; }
        public bool Terrace { get; set; }
        public bool Registered { get; set; }
        public float Area { get; set; }
        public string Address { get; set; }
        public float NumberOfRooms { get; set; }
        public List<string> ImagePaths { get; set; } = new();
        public List<int> AmenityIds { get; set; } = new();
        public decimal? Lat { get; set; }
        public decimal? Lng { get; set; }
        public int Status { get; set; } = RealEstateStatus.Available;
        public bool ShowMap { get; set; } = true;
    }
}
