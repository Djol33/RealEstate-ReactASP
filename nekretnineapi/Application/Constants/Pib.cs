namespace Application
{
    public static class Pib
    {
        public const int Length = 9;

        public static bool IsValid(string? pib)
        {
            if (string.IsNullOrWhiteSpace(pib))
                return false;

            var value = pib.Trim();
            if (value.Length != Length)
                return false;

            foreach (var c in value)
            {
                if (c < '0' || c > '9')
                    return false;
            }

            return value[Length - 1] - '0' == CheckDigit(value);
        }

        private static int CheckDigit(string pib)
        {
            var product = 10;

            for (var i = 0; i < Length - 1; i++)
            {
                var sum = (product + (pib[i] - '0')) % 10;
                if (sum == 0)
                    sum = 10;

                product = (sum * 2) % 11;
            }

            return (11 - product) % 10;
        }
    }
}
