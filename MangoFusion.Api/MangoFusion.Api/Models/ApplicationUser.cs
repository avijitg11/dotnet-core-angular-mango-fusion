using Microsoft.AspNetCore.Identity;

namespace MangoFusion.Api.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; } = string.Empty;
    }
}
