using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Recycling_Kiosk.Utils
{
    public class Kiosk
    {
        public string Name;
        public double Longitude;
        public double Latitude;
        public string Address;

        public object Distance { get; internal set; }
    }
}