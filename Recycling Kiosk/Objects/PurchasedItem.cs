using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Recycling_Kiosk.Objects
{
    public class PurchasedItem
    {
        public string Email { get; set; }
        public string ProductID { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
    }
}