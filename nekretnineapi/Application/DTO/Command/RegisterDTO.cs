using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
namespace Application.DTO.Command
{
    public class RegisterDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
       // public bool UserType { get; set; } // 1-company, 0-user

    }

    public class RegisterUserDTO : RegisterDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }

    public class RegisterCompanyDTO  : RegisterDTO 
    {
        [JsonPropertyName("companyName")]
        public string Name { get; set; }
        public string BIP { get; set; }
        
    }
}
