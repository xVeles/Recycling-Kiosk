using Microsoft.Data.Sqlite;
using Recycling_Kiosk.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Recycling_Kiosk.Controller
{
    public class UsersController : ApiController
    {
        private readonly ConfigReader configReader = new ConfigReader();
        /// <summary>
        /// Gets login info for user
        /// </summary>
        /// <param name="user">User to login (Email/Username & Password req)</param>
        /// <returns>User if successful login</returns>
        [HttpGet]
        public new HttpResponseMessage User(User user)
        {
            using (SqliteConnection sqliteConnection = DBConnecter.DBConnect())
            {
                using (SqliteCommand sqliteCommand = new SqliteCommand("SELECT * FROM Users WHERE Username=@user OR Email=@email", sqliteConnection))
                {
                    sqliteCommand.Parameters.Add(new SqliteParameter("@user", StrUtils.Santize(user.Username)));
                    sqliteCommand.Parameters.Add(new SqliteParameter("@email", StrUtils.Santize(user.Email)));
                    try
                    {
                        using (SqliteDataReader sqliteDataReader = sqliteCommand.ExecuteReader())
                        {
                            while (sqliteDataReader.Read())
                            {
                                string userPassword = (string)sqliteDataReader["Password"];
                                string password = StrUtils.Hash(string.Format("{0}:{1}:{2}", user.Email, user.Password, configReader.GetString("Realm")));

                                if (password == userPassword)
                                {
                                    password = "";
                                    user.Password = "";
                                    user.Firstname = (string)sqliteDataReader["Firstname"];
                                    user.Lastname = (string)sqliteDataReader["Lastname"];
                                    user.Points = (int)sqliteDataReader["Points"];
                                    user.Username = (string)sqliteDataReader["Username"];
                                    user.Email = (string)sqliteDataReader["Email"];
                                    return Request.CreateResponse(HttpStatusCode.OK, user);
                                }
                                else
                                {
                                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid Username/Email or Password");
                                }
                            }

                            sqliteDataReader.Close();
                        }
                    }
                    catch
                    {
                        return Request.CreateResponse(HttpStatusCode.BadRequest, "Internal Server Error: DB Connection fail");
                    }
                }
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, "Internal Server Error: Execution failure");
        }
        
        [HttpPost]
        public new HttpResponseMessage Register(User user)
        {
            using (SqliteConnection sqliteConnection = DBConnecter.DBConnect())
            {
                user.Username = StrUtils.Santize(user.Username);
                user.Firstname = StrUtils.Santize(user.Firstname);
                user.Lastname = StrUtils.Santize(user.Lastname);

                using (SqliteCommand sqliteCommand = new SqliteCommand("SELECT * FROM Users WHERE Username=@user OR Email=@email", sqliteConnection))
                {
                    sqliteCommand.Parameters.Add(new SqliteParameter("@user", user.Username));
                    sqliteCommand.Parameters.Add(new SqliteParameter("@email", user.Email));

                    try
                    {
                        using (SqliteDataReader sqliteDataReader = sqliteCommand.ExecuteReader())
                        {
                            while (sqliteDataReader.Read())
                            {
                                if (user.Username == (string)sqliteDataReader["Username"])
                                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Username not avaliable");
                                else if (user.Email == (string)sqliteDataReader["Email"])
                                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Email not avaliable");
                            }
                        }
                    catch
                    {
                        return Request.CreateResponse(HttpStatusCode.BadRequest, "Internal Server Error: DB Connection fail");
                    }
                }



                using (SqliteCommand sqliteCommand = new SqliteCommand("INSERT INTO Users(\'Username\', \'Firstname\', \'Lastname\', \'Password\', \'Email\') VALUES (\'@user\', \'@firstname\', \'@lastname\', \'@passowrd\', \'@email\');"))
                {
                    sqliteCommand.Parameters.Add(new SqliteParameter("@user", user.Username));
                }
            }
        }
    }
}
