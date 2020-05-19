using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Recycling_Kiosk.Objects
{
    public class ShopItem
    {
        public string ProductID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Stock { get; set; }
        public int CategoryID { get; set; }
        public double Price { get; set; }
        public string ShopImg { get; set; }
        public string Size { get; set; }
    }
}