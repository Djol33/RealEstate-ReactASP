namespace Application.DTO.Command
{
    public class EditRealestateDTO
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int CityId { get; set; }
        public int TypeObjectId { get; set; }
        public bool Terrace { get; set; }
        public float Area { get; set; }
        public string Address { get; set; }
        public float NumberOfRooms { get; set; }
        public List<string> ImagePaths { get; set; } = new();
        public List<long> ExistingImageIds { get; set; } = new();
    }
}
