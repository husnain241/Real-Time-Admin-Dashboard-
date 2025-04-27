using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{
    public bool IsOnline { get; set; }
}
