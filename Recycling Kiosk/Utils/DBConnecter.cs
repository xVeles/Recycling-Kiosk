using Microsoft.Data.Sqlite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Recycling_Kiosk.Utils
{
    public class DBConnecter
    {
        public static SqliteConnection DBConnect()
        {
            ConfigReader configReader = new ConfigReader();
            Console.WriteLine(configReader.GetString("DataRoot") + "/data.db");
            SqliteConnection sqliteConnection = new SqliteConnection(string.Format("Data Source={0};Version=3;", configReader.GetString("DataRoot") + "/data.db"));
            sqliteConnection.Open();
            return sqliteConnection;
        }
    }
}