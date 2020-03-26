using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Recycling_Kiosk.Controllers
{
    public class HomeController : Controller
    {
        public string Index()
        {
            return "Hello";
        }

        public string Test()
        {
            return "Tset";
        }

        [HttpPost]
        public string Extra()
        {
            return "extra";
        }
    }
}
