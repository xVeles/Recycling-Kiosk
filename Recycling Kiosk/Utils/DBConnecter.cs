using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Linq;
using System.Web;

namespace Recycling_Kiosk.Utils
{
    public class DBConnecter
    {
        public static SQLiteConnection DBConnect()
        {
            ConfigReader configReader = new ConfigReader();
            SQLiteConnection sqliteConnection = new SQLiteConnection(string.Format("Data Source={0};Version=3;", configReader.GetString("DataRoot") + "data.db"));
            sqliteConnection.Open();
            return sqliteConnection;
        }
    }
}