using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace Recycling_Kiosk.Utils
{
    public class ConfigReader
    {
        private AppSettingsReader config;

        public ConfigReader()
        {
            config = new AppSettingsReader();
        }

        public string GetString(string key)
        {
            string str = "";
            try
            {
                str = (string)config.GetValue(key, typeof(string));
            }
            catch
            {
            }
            return str;
        }
        /*
        public int GetInt32(string key, int defVal = 0)
        {
            int num = defVal;
            try
            {
                num = (int)config.GetValue(key, typeof(int));
            }
            catch (Exception ex)
            {
            }
            return num;
        }*/
    }
}