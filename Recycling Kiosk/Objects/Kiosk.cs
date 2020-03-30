using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Recycling_Kiosk.Objects
{
    public class Kiosk
    {
        public string Name { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public string Address { get; set; }
        public double Distance { get; set; }
        public string KioskType { get; set; }
    }
}