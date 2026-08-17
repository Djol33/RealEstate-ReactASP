namespace Application
{
    public static class RealEstateStatus
    {
        public const int Available = 0;
        public const int Reserved = 1;
        public const int Sold = 2;

        public static string GetLabel(int status) => status switch
        {
            Available => "Available",
            Reserved => "Reserved",
            Sold => "Sold",
            _ => "Unknown"
        };
    }
}
