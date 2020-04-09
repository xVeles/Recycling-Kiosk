using Recycling_Kiosk.Modules;
using Recycling_Kiosk.Objects;
using Recycling_Kiosk.Utils;
using System;
using System.Data.SQLite;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Recycling_Kiosk.Controllers
{
    public class UsersController : ApiController
    {
        private readonly ConfigReader configReader = new ConfigReader();

        [BasicAuthentication]
        [Route("api/users/login")]
        [HttpGet]
        public HttpResponseMessage Login([FromBody] User user)
        {
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
                                user.Password = "";
                                user.Firstname = (string)sqliteDataReader["Firstname"];
                                user.Lastname = (string)sqliteDataReader["Lastname"];
                                user.Username = (string)sqliteDataReader["Username"];
                                user.Recycle = Convert.ToInt16(sqliteDataReader["Recycle"]);
                                user.Upcycle = Convert.ToInt16(sqliteDataReader["Upcycle"]);
                                user.Donate = Convert.ToInt16(sqliteDataReader["Donate"]);

                                sqliteDataReader.Close();
                                sqliteConnection.Close();

                                return Request.CreateResponse(HttpStatusCode.OK, user);
                            }

                            sqliteDataReader.Close();
                            sqliteConnection.Close();
                        }
                    }
                    catch (Exception ex)
                    {
                        sqliteConnection.Close();
                        return Request.CreateResponse(HttpStatusCode.InternalServerError, "Internal Server Error: DB Select fail - " + ex.ToString());
                    }
                }
            }
            return Request.CreateResponse(HttpStatusCode.InternalServerError, "Internal Server Error: Execution fail");
        }
        
        [Route("api/users/register")]
        [HttpPost]
        public HttpResponseMessage Register([FromBody] User user)
        {
            Console.WriteLine("Recieved Details: {0} {1} {2} {3} {4} {5}", user.Username, user.Firstname, user.Lastname, user.Password, user.Email, user.Recycle);
            using (SQLiteConnection sqliteConnection = DBConnecter.DBConnect())
            {
                user.Username = StrUtils.Sanitize(user.Username);
                user.Firstname = StrUtils.Sanitize(user.Firstname);
                user.Lastname = StrUtils.Sanitize(user.Lastname);

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

                            sqliteDataReader.Close();
                        }
                    }
                    catch
                    {
                    }
                    

                    using (SQLiteCommand sqliteInsertCommand = new SQLiteCommand("INSERT INTO Users(Username, Firstname, Lastname, Password, Email, Recycle, Upcycle, Donate) VALUES (@user, @firstname, @lastname, @password, @email, @recycle, @upcycle, @donate);", sqliteConnection))
                    {
                        user.Password = StrUtils.Hash(string.Format("{0}:{1}:{2}", user.Email, user.Password, configReader.GetString("Realm")));
                        sqliteInsertCommand.Parameters.Add(new SQLiteParameter("@user", user.Username));
                        sqliteInsertCommand.Parameters.Add(new SQLiteParameter("@firstname", user.Firstname));
                        sqliteInsertCommand.Parameters.Add(new SQLiteParameter("@lastname", user.Lastname));
                        sqliteInsertCommand.Parameters.Add(new SQLiteParameter("@password", user.Password));
                        sqliteInsertCommand.Parameters.Add(new SQLiteParameter("@email", user.Email));
                        sqliteInsertCommand.Parameters.Add(new SQLiteParameter("@recycle", user.Recycle));
                        sqliteInsertCommand.Parameters.Add(new SQLiteParameter("@upcycle", user.Upcycle));
                        sqliteInsertCommand.Parameters.Add(new SQLiteParameter("@donate", user.Donate));

                        try
                        {
                            sqliteInsertCommand.ExecuteNonQuery();
                            sqliteConnection.Close();

                            return Request.CreateResponse(HttpStatusCode.OK, "User Registered");
                        }
                        catch (Exception ex)
                        {
                            sqliteConnection.Close();

                            return Request.CreateResponse(HttpStatusCode.InternalServerError, "Internal Server Error: DB Insert fail - " + ex.ToString());
                        }
                    }
                }
            }
        }

        [BasicAuthentication]
        [Route("api/users/update")]
        [HttpPost]
        public HttpResponseMessage Update([FromBody] User user)
        {
            
            using (SQLiteConnection sqliteConnection = DBConnecter.DBConnect())
            {
                using (SQLiteCommand sqliteCommand = new SQLiteCommand("UPDATE Users SET Firstname = @firstname, Lastname = @lastname, Password = @password, Email = @email, Recycle = @recycle, Upcycle = @upcycle, Donate = @donate WHERE Username = @user", sqliteConnection))
                {
                    user.Password = StrUtils.Hash(string.Format("{0}:{1}:{2}", user.Email, user.Password, configReader.GetString("Realm")));
                    sqliteCommand.Parameters.Add(new SQLiteParameter("@firstname", StrUtils.Sanitize(user.Firstname)));
                    sqliteCommand.Parameters.Add(new SQLiteParameter("@lastname", StrUtils.Sanitize(user.Lastname)));
                    sqliteCommand.Parameters.Add(new SQLiteParameter("@password", user.Password));
                    sqliteCommand.Parameters.Add(new SQLiteParameter("@email", user.Email));
                    sqliteCommand.Parameters.Add(new SQLiteParameter("@user", StrUtils.Sanitize(user.Username)));
                    sqliteCommand.Parameters.Add(new SQLiteParameter("@recycle", user.Recycle));
                    sqliteCommand.Parameters.Add(new SQLiteParameter("@upcycle", user.Upcycle));
                    sqliteCommand.Parameters.Add(new SQLiteParameter("@donate", user.Donate));

                    try
                    {
                        sqliteCommand.ExecuteNonQuery();
                        sqliteConnection.Close();

                        return Request.CreateResponse(HttpStatusCode.OK, "User updated");
                    }
                    catch (Exception ex)
                    {
                        sqliteConnection.Close();

                        return Request.CreateResponse(HttpStatusCode.InternalServerError, "Internal Server Error: DB Insert fail - " + ex.ToString());
                    }
                }
            }
        }
    }
}
