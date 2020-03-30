using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Recycling_Kiosk.Objects
{
    public class User
    {
        public string Username { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public int Points { get; set; }
        public int Recycle { get; set; }
        public int Upcycle { get; set; }
        public int Donate { get; set; }
    }
}