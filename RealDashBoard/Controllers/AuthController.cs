    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.IdentityModel.Tokens;
    using System.IdentityModel.Tokens.Jwt;
    using System.Linq;
    using System.Security.Claims;
    using System.Text;
    using System.Threading.Tasks;

    [ApiController]
    [Route("api/[controller]")]


    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _config;
    private readonly ChatRepository _chatRepo;



        public AuthController(
         UserManager<ApplicationUser> userManager,
         SignInManager<ApplicationUser> signInManager,
         ChatRepository chatRepo,
         IConfiguration config)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        _config = config;
            _chatRepo = chatRepo;

    }

    private string GenerateJwtToken(ApplicationUser user, IList<string> roles)
        {
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Role, roles.FirstOrDefault() ?? "User")
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


    [Authorize(Roles = "Admin")]
    [HttpGet("all-users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = _userManager.Users.ToList();

        var userList = new List<object>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userList.Add(new
            {
                user.Id,
                user.Email,
                user.UserName,
                user.IsOnline,
                Role = roles.FirstOrDefault() ?? "User"
            });
        }

        return Ok(userList);
    }



    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { msg = "Invalid input" });

        // Check if email already exists
        var existingUser = await _userManager.FindByEmailAsync(model.Email);
        if (existingUser != null)
            return BadRequest(new { msg = "Email already registered" });

        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email,
            IsOnline = false
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
        {
            // Extract and send a clean error message
            var errors = result.Errors.Select(e => e.Description).ToList();
            return BadRequest(new { msg = errors.FirstOrDefault() ?? "Registration failed" });
        }

        return Ok(new { msg = "User registered successfully" });
    }


    [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid input");

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return Unauthorized("User not found");

        var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, false);
        if (!result.Succeeded)
            return Unauthorized("Invalid credentials");

        user.IsOnline = true; // 👈 Set online status
        await _userManager.UpdateAsync(user);


        var roles = await _userManager.GetRolesAsync(user);
            var token = GenerateJwtToken(user, roles);

            return Ok(new
            {
                token,
                role = roles.FirstOrDefault() ?? "User",
                email = user.Email
            });
        }


        [AllowAnonymous]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user != null)
            {
                user.IsOnline = false;
                await _userManager.UpdateAsync(user);
            }

            // ❌ Don't use SignOutAsync() — no cookie/session auth here
            return Ok("Logged out");
        }

    [HttpGet("chat/history")]
    public IActionResult GetChatHistory([FromQuery] string user1, [FromQuery] string user2)
    {
        var messages = _chatRepo.GetChatHistory(user1, user2);
        return Ok(messages);
    }


    [Authorize(Roles = "Admin")]
    [HttpDelete("delete-user/{email}")]
    public async Task<IActionResult> DeleteUser(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return NotFound("User not found");

        var result = await _userManager.DeleteAsync(user);

        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description);
            return BadRequest(new { message = string.Join("; ", errors) });
        }

        return Ok("User deleted successfully");
    }



}
