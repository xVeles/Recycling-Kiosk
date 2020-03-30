using Recycling_Kiosk.Utils;
using System;
using System.Data.SQLite;
using System.Net;
using System.Web.Mvc;

namespace Recycling_Kiosk.Controllers
{
    public class UsersController : Controller
    {
        private readonly ConfigReader configReader = new ConfigReader();

        [HttpGet]
        public ActionResult Login(User user)
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

                                    return new JsonResult
                                    {
                                        Data = user,
                                        JsonRequestBehavior = JsonRequestBehavior.AllowGet
                                    };
                                }
                                else
                                {
                                    sqliteDataReader.Close();

                                    return new HttpStatusCodeResult(HttpStatusCode.BadRequest, "Invalid Username/Email or Password");
                                }
                            }

                            sqliteConnection.Close();
                        }
                    }
                    catch (Exception ex)
                    {
                        sqliteConnection.Close();
                        return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, "Internal Server Error: DB Insert fail - " + ex.ToString());
                    }
                }
            }
            return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, "Internal Server Error: Execution fail");
        }
        

        [HttpPost]
        public ActionResult Register(User user)
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
                                    return new HttpStatusCodeResult(HttpStatusCode.BadRequest, errorMsg);
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

                            return new JsonResult
                            {
                                Data = "User registered."
                            };
                        }
                        catch (Exception ex)
                        {
                            sqliteConnection.Close();

                            return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, "Internal Server Error: DB Insert fail - " + ex.ToString());
                        }
                    }
                }
            }
        }
        
        [HttpPost]
        public ActionResult Update(User user)
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

                        return new JsonResult
                        {
                            Data = "Account updated"
                        };
                    }
                    catch (Exception ex)
                    {
                        sqliteConnection.Close();

                        return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, "Internal Server Error: DB Insert fail - " + ex.ToString());
                    }
                }
            }
        }
    }
}
