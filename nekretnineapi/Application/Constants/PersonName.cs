using System.Text.RegularExpressions;

namespace Application
{
    public static class PersonName
    {
        public const int MinLength = 3;
        public const int MaxLength = 30;

        private static readonly Regex Allowed =
            new(@"^\p{L}+(?:[ '\-]\p{L}+)*$", RegexOptions.Compiled);

        public static bool IsValid(string? name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return false;

            return Allowed.IsMatch(name.Trim());
        }
    }
}
