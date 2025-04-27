using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

public static class SeedData
{
    public static async Task InitializeAsync(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        string adminEmail = "admin@example.com";
        string adminPassword = "Admin@123";

        // Ensure the Admin role exists
        if (!await roleManager.RoleExistsAsync("Admin"))
        {
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        }

        // Delete old admin user if exists
        var existingUser = await userManager.FindByEmailAsync(adminEmail);
        if (existingUser != null)
        {
            await userManager.DeleteAsync(existingUser);
        }

        // Create new admin user
        var adminUser = new ApplicationUser { UserName = adminEmail, Email = adminEmail };
        var result = await userManager.CreateAsync(adminUser, adminPassword);
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
    }
}
