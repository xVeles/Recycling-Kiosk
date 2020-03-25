using Recycling_Kiosk.Utils;
using System;
using System.Collections.Generic;
using System.Data.SQLite;
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
            Console.WriteLine("Recieved Details: {0} {1} {2} {3} {4} {5}", user.Username, user.Firstname, user.Lastname, user.Password, user.Email, user.Points);
            using (SQLiteConnection sqliteConnection = DBConnecter.DBConnect())
            {

                using (SQLiteCommand sqliteCommand = new SQLiteCommand("SELECT * FROM Users WHERE Email=@email", sqliteConnection))
                {
                    sqliteCommand.Parameters.Add(new SQLiteParameter("@email", user.Email));

                    try
                    {
                        using (SQLiteDataReader sqliteDataReader = sqliteCommand.ExecuteReader())
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
                                    user.Username = (string)sqliteDataReader["Username"];
                                    sqliteDataReader.Close();
                                    return Request.CreateResponse(HttpStatusCode.OK, user);
                                }
                                else
                                {
                                    sqliteDataReader.Close();
                                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid Username/Email or Password");
                                }
                            }

                            sqliteConnection.Close();
                        }
                    }
                    catch (Exception ex)
                    {
                        sqliteConnection.Close();
                        return Request.CreateResponse(HttpStatusCode.BadRequest, "Internal Server Error: DB Connection fail\n" + ex.ToString());
                    }
                }
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, "Internal Server Error: Execution failure");
        }
        

        [HttpPost]
        public new HttpResponseMessage Register(User user)
        {
            Console.WriteLine("Recieved Details: {0} {1} {2} {3} {4} {5}", user.Username, user.Firstname, user.Lastname, user.Password, user.Email, user.Points);
            using (SQLiteConnection sqliteConnection = DBConnecter.DBConnect())
            {
                user.Username = StrUtils.Santize(user.Username);
                user.Firstname = StrUtils.Santize(user.Firstname);
                user.Lastname = StrUtils.Santize(user.Lastname);

                using (SQLiteCommand sqliteSelectCommand = new SQLiteCommand("SELECT * FROM Users WHERE Username=@user OR Email=@email", sqliteConnection))
                {
                    sqliteSelectCommand.Parameters.Add(new SQLiteParameter("@user", user.Username));
                    sqliteSelectCommand.Parameters.Add(new SQLiteParameter("@email", user.Email));
                    try
                    {
                        using (SQLiteDataReader sqliteDataReader = sqliteSelectCommand.ExecuteReader())
                        {
                            while (sqliteDataReader.Read())
                            {
                                string errorMsg = "";
                                if (user.Username == (string)sqliteDataReader["Username"])
                                    errorMsg = "Username not avaliable";
                                else if (user.Email == (string)sqliteDataReader["Email"])
                                    errorMsg = "Email not avaliable";

                                sqliteDataReader.Close();

                                if (errorMsg != "")
                                {
                                    sqliteConnection.Close();
                                    return Request.CreateResponse(HttpStatusCode.BadRequest, errorMsg);
                                }
                            }
                        }
                    }
                    catch
                    {
                    }
                    

                    using (SQLiteCommand sqliteInsertCommand = new SQLiteCommand("INSERT INTO Users(Username, Firstname, Lastname, Password, Email) VALUES (@user, @firstname, @lastname, @password, @email);", sqliteConnection))
                    {
                        user.Password = StrUtils.Hash(string.Format("{0}:{1}:{2}", user.Email, user.Password, configReader.GetString("Realm")));
                        sqliteInsertCommand.Parameters.Add(new SQLiteParameter("@user", user.Username));
                        sqliteInsertCommand.Parameters.Add(new SQLiteParameter("@firstname", user.Firstname));
                        sqliteInsertCommand.Parameters.Add(new SQLiteParameter("@lastname", user.Lastname));
                        sqliteInsertCommand.Parameters.Add(new SQLiteParameter("@password", user.Password));
                        sqliteInsertCommand.Parameters.Add(new SQLiteParameter("@email", user.Email));

                        Console.WriteLine(sqliteInsertCommand.CommandText);

                        try
                        {
                            sqliteInsertCommand.ExecuteNonQuery();
                            sqliteConnection.Close();

                            return Request.CreateResponse(HttpStatusCode.OK, "User Registered");
                        }
                        catch (Exception ex)
                        {
                            sqliteConnection.Close();

                            return Request.CreateResponse(HttpStatusCode.BadRequest, "Internal Server Error: DB Insert fail - ", ex.ToString());
                        }
                    }
                }
            }
        }
        
        [Route("api/users/update")]
        [HttpPost]
        public new HttpResponseMessage Update(User user)
        {
            
            using (SQLiteConnection sqliteConnection = DBConnecter.DBConnect())
            {
                using (SQLiteCommand sqliteCommand = new SQLiteCommand("UPDATE Users SET Firstname = @firstname, Lastname = @lastname, Password = @password, Email = @email WHERE Username = @user", sqliteConnection))
                {
                    user.Password = StrUtils.Hash(string.Format("{0}:{1}:{2}", user.Email, user.Password, configReader.GetString("Realm")));
                    sqliteCommand.Parameters.Add(new SQLiteParameter("@firstname", user.Firstname));
                    sqliteCommand.Parameters.Add(new SQLiteParameter("@lastname", user.Lastname));
                    sqliteCommand.Parameters.Add(new SQLiteParameter("@password", user.Password));
                    sqliteCommand.Parameters.Add(new SQLiteParameter("@email", user.Email));
                    sqliteCommand.Parameters.Add(new SQLiteParameter("@user", user.Username));

                    try
                    {
                        sqliteCommand.ExecuteNonQuery();
                        sqliteConnection.Close();

                        return Request.CreateResponse(HttpStatusCode.OK, "Updated Profile");
                    }
                    catch (Exception ex)
                    {
                        sqliteConnection.Close();

                        return Request.CreateResponse(HttpStatusCode.BadRequest, "Internal Server Error: DB Insert fail - ", ex.ToString());
                    }
                }
            }
        }
    }
}
