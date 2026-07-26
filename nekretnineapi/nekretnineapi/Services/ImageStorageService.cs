using FluentValidation;
using FluentValidation.Results;

namespace nekretnineapi.Services
{
    public class ImageStorageService
    {
        private readonly IWebHostEnvironment env;

        private static readonly HashSet<string> AllowedExtensions =
            new(StringComparer.OrdinalIgnoreCase) { ".jpg", ".jpeg", ".png", ".webp" };

        private static readonly HashSet<string> AllowedContentTypes =
            new(StringComparer.OrdinalIgnoreCase) { "image/jpeg", "image/png", "image/webp" };

        private const long MaxFileSizeBytes = 5 * 1024 * 1024;
        private const int MaxFileCount = 10;

        public const long MaxRequestSizeBytes = (MaxFileSizeBytes * MaxFileCount) + (10 * 1024 * 1024);

        public ImageStorageService(IWebHostEnvironment env)
        {
            this.env = env;
        }

        public List<string> Save(List<IFormFile>? images)
        {
            var paths = new List<string>();
            if (images == null || images.Count == 0)
                return paths;

            if (images.Count > MaxFileCount)
                throw new ValidationException(new[]
                {
                    new ValidationFailure("images",
                        $"A maximum of {MaxFileCount} images per request is allowed.")
                });

            foreach (var file in images)
                Validate(file);

            var uploadsFolder = Path.Combine(env.ContentRootPath, "uploads");
            Directory.CreateDirectory(uploadsFolder);

            foreach (var file in images)
            {
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                var fileName = Guid.NewGuid().ToString() + extension;
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                paths.Add("images/" + fileName);
            }

            return paths;
        }

        private static void Validate(IFormFile file)
        {
            var failures = new List<ValidationFailure>();

            if (file.Length == 0)
                failures.Add(new ValidationFailure("images", $"File '{file.FileName}' is empty."));

            if (file.Length > MaxFileSizeBytes)
                failures.Add(new ValidationFailure("images",
                    $"File '{file.FileName}' is larger than the allowed {MaxFileSizeBytes / (1024 * 1024)} MB."));

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || !AllowedExtensions.Contains(extension))
                failures.Add(new ValidationFailure("images",
                    $"File '{file.FileName}' has a disallowed extension. Allowed: {string.Join(", ", AllowedExtensions)}."));

            if (!AllowedContentTypes.Contains(file.ContentType))
                failures.Add(new ValidationFailure("images",
                    $"File '{file.FileName}' has a disallowed content type ({file.ContentType})."));

            if (extension is ".jpg" or ".jpeg" or ".png" or ".webp" && !HasValidSignature(file))
                failures.Add(new ValidationFailure("images",
                    $"Content of file '{file.FileName}' is not a valid image (JPEG/PNG/WebP)."));

            if (failures.Count > 0)
                throw new ValidationException(failures);
        }

        private static bool HasValidSignature(IFormFile file)
        {
            Span<byte> header = stackalloc byte[12];
            int read;
            using (var stream = file.OpenReadStream())
            {
                read = stream.Read(header);
            }

            if (read < 12)
                return false;

            if (header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF)
                return true;

            if (header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47 &&
                header[4] == 0x0D && header[5] == 0x0A && header[6] == 0x1A && header[7] == 0x0A)
                return true;

            if (header[0] == 0x52 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x46 &&
                header[8] == 0x57 && header[9] == 0x45 && header[10] == 0x42 && header[11] == 0x50)
                return true;

            return false;
        }
    }
}
