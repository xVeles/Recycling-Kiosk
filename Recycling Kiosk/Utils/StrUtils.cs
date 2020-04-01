using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace Recycling_Kiosk.Utils
{
    public class StrUtils
    {
        public static string Hash(params string[] input)
        {
            MD5 md5 = MD5.Create();
            StringBuilder stringBuilder = new StringBuilder();
            for (int index = 0; index < input.Length; ++index)
            {
                string str = input[index];
                stringBuilder.AppendFormat(index == input.Length - 1 ? "{0}" : "{0}:", (object)str);
            }
            byte[] bytes = Encoding.UTF8.GetBytes(stringBuilder.ToString());
            byte[] hash = md5.ComputeHash(bytes);
            stringBuilder.Clear();
            for (int index = 0; index < hash.Length; ++index)
                stringBuilder.Append(hash[index].ToString("x2"));
            return stringBuilder.ToString();
        }

        public static string Sanitize(string input)
        {
            input = Regex.Replace(input, "[^\\p{L}\\p{N} ]+", string.Empty);
            input = Regex.Replace(input, "<.*?>", string.Empty);
            return input;
        }
    }
}