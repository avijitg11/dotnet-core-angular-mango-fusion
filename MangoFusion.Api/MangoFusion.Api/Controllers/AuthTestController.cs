using MangoFusion.Api.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MangoFusion.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthTestController : ControllerBase
    {
        [HttpGet]
        [Authorize]
        public ActionResult<string> GetSomething()
        {
            return "You are authorized user";
        }

        [HttpGet("{someValue:int}")]
        [Authorize(Roles = SD.Role_Admin)]
        public ActionResult<string> GetSomething(int someValue)
        {
            return "You are authorized user, with Role of Admin";
        }
    }
}
