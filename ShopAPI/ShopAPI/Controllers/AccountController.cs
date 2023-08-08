using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ShopAPI.Models;
using ShopAPI.Services;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ShopAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly ApplicationDbContext context;
        private readonly EmailSender emailSender;

        public AccountController(IConfiguration configuration, ApplicationDbContext context, EmailSender emailSender)
        {
            this.configuration = configuration;
            this.context = context;
            this.emailSender = emailSender;
        }

        //user registration
        [HttpPost("Register")]
        public IActionResult Register(UserDto userDto)
        {
            // check if the email address is already user or not
            var emailCount = context.Users.Count(u => u.Email == userDto.Email);
            if (emailCount > 0)
            {
                ModelState.AddModelError("Email", "This Email address is already used");
                return BadRequest(ModelState);
            }


            // encrypt the password
            var passwordHasher = new PasswordHasher<User>();
            var encryptedPassword = passwordHasher.HashPassword(new User(), userDto.Password);


            // create new account
            User user = new User()
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email,
                Phone = userDto.Phone ?? "",
                Address = userDto.Address,
                Password = encryptedPassword,
                Role = "client",
                CreatedAt = DateTime.Now
            };

            context.Users.Add(user);
            context.SaveChanges();

            var jwt = CreateJWToken(user);

            UserProfileDto userProfileDto = new UserProfileDto()
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };

            var response = new
            {
                Token = jwt,
                User = userProfileDto
            };


            return Ok(response);
        }

        //user login
        [HttpPost("Login")]
        public IActionResult Login(string email, string password)
        {
            var user = context.Users.FirstOrDefault(u => u.Email == email);
            if (user == null)
            {
                ModelState.AddModelError("Error", "Email or Password not valid");
                return BadRequest(ModelState);
            }


            // verify the password
            var passwordHasher = new PasswordHasher<User>();
            var result = passwordHasher.VerifyHashedPassword(new User(), user.Password, password);
            if (result == PasswordVerificationResult.Failed)
            {
                ModelState.AddModelError("Password", "Wrong Password");
                return BadRequest(ModelState);
            }


            var jwt = CreateJWToken(user);

            UserProfileDto userProfileDto = new UserProfileDto()
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };

            var response = new
            {
                Token = jwt,
                User = userProfileDto
            };


            return Ok(response);
        }

        //Forgot Password
        [HttpPost("ForgotPassword")]
        public IActionResult ForgotPassword(string email)
        {
            var user = context.Users.FirstOrDefault(u => u.Email == email);
            if (user == null)
            {
                return NotFound();
            }

            // delete any old password reset request
            var oldPwdReset = context.PasswordResets.FirstOrDefault(r => r.Email == email);
            if (oldPwdReset != null)
            {
                // delete old password reset request
                context.Remove(oldPwdReset);
            }

            // create Password Reset Token
            string token = Guid.NewGuid().ToString() + "-" + Guid.NewGuid().ToString();

            var pwdReset = new PasswordReset()
            {
                Email = email,
                Token = token,
                CreatedAt = DateTime.Now
            };

            context.PasswordResets.Add(pwdReset);
            context.SaveChanges();


            // send the Password Reset Token by email to the user
            string emailSubject = "Password Reset";
            string username = user.FirstName + " " + user.LastName;
            string emailMessage = "Dear " + username + "\n" +
                "We received your password reset request.\n" +
                "Please copy the following token and paste it in the Password Reset Form:\n" +
                token + "\n\n" +
                "Best Regards\n";


            emailSender.SendEmail(emailSubject, email, username, emailMessage).Wait();

            return Ok();
        }

        //Reset Password
        [HttpPost("ResetPassword")]
        public IActionResult ResetPassword(string token, string password)
        {
            var pwdReset = context.PasswordResets.FirstOrDefault(r => r.Token == token);
            if (pwdReset == null)
            {
                ModelState.AddModelError("Token", "Wrong or Expired Token");
                return BadRequest(ModelState);
            }

            var user = context.Users.FirstOrDefault(u => u.Email == pwdReset.Email);
            if (user == null)
            {
                ModelState.AddModelError("Token", "Wrong or Expired Token");
                return BadRequest(ModelState);
            }

            // encrypt password
            var passwordHasher = new PasswordHasher<User>();
            string encryptedPassword = passwordHasher.HashPassword(new User(), password);


            // save the new encrypted password
            user.Password = encryptedPassword;


            // delete the token
            context.PasswordResets.Remove(pwdReset);


            context.SaveChanges();

            return Ok();
        }

        //Get user profile
        [Authorize]
        [HttpGet("Profile")]
        public IActionResult GetProfile()
        {
            int id = JwtReader.GetUserId(User);


            var user = context.Users.Find(id);
            if (user == null)
            {
                return Unauthorized();
            }

            var userProfileDto = new UserProfileDto()
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };

            return Ok(userProfileDto);
        }

        //update user profile
        [Authorize]
        [HttpPut("UpdateProfile")]
        public IActionResult UpdateProfile(UserProfileUpdateDto userProfileUpdateDto)
        {
            int id = JwtReader.GetUserId(User);

            var user = context.Users.Find(id);
            if (user == null)
            {
                return Unauthorized();
            }

            // update the user profile
            user.FirstName = userProfileUpdateDto.FirstName;
            user.LastName = userProfileUpdateDto.LastName;
            user.Email = userProfileUpdateDto.Email;
            user.Phone = userProfileUpdateDto.Phone ?? "";
            user.Address = userProfileUpdateDto.Address;

            context.SaveChanges();

            var userProfileDto = new UserProfileDto()
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };

            return Ok(userProfileDto);
        }

        //update user password
        [Authorize]
        [HttpPut("UpdatePassword")]
        public IActionResult UpdatePassword([Required, MinLength(8), MaxLength(100)] string password)
        {
            int id = JwtReader.GetUserId(User);

            var user = context.Users.Find(id);
            if (user == null)
            {
                return Unauthorized();
            }


            // encrypt password
            var passwordHasher = new PasswordHasher<User>();
            string encryptedPassword = passwordHasher.HashPassword(new User(), password);


            // update the user password
            user.Password = encryptedPassword;

            context.SaveChanges();

            return Ok();
        }

        //create jwt token for user
        private string CreateJWToken(User user)
        {
            List<Claim> claims = new List<Claim>()
            {
                new Claim("id", "" + user.Id),
                new Claim("role", user.Role)
            };

            string strKey = configuration["JwtSettings:Key"]!;

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(strKey));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var token = new JwtSecurityToken(
                issuer: configuration["JwtSettings:Issuer"],
                audience: configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;


        }
    }
}
