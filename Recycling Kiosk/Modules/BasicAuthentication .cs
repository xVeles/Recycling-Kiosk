using Recycling_Kiosk.Utils;
using System;
using System.Data.SQLite;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Threading;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace Recycling_Kiosk.Modules
{
    public class BasicAuthenticationAttribute : AuthorizationFilterAttribute
    {
        private static readonly ConfigReader configReader = new ConfigReader();

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (actionContext.Request.Headers.Authorization != null)
            {
                var authToken = actionContext.Request.Headers.Authorization.Parameter;

                // decoding authToken we get decode value in 'Username:Password' format  
                var decodeauthToken = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(authToken));

                // spliting decodeauthToken using ':'   
                var arrUserNameandPassword = decodeauthToken.Split(':');

                // at 0th postion of array we get username and at 1st we get password  
                if (IsAuthorizedUser(arrUserNameandPassword[0], arrUserNameandPassword[1]))
                {
                    // setting current principle  
                    Thread.CurrentPrincipal = new GenericPrincipal(new GenericIdentity(arrUserNameandPassword[0]), null);
                }
                else
                {
                    actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized);
                }
            }
            else
            {
                actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized);
            }

            
        }

        public static bool IsAuthorizedUser(string email, string password)
        {
            using (SQLiteConnection sqliteConnection = DBConnecter.DBConnect())
            {

                using (SQLiteCommand sqliteCommand = new SQLiteCommand("SELECT * FROM Users WHERE Email=@email", sqliteConnection))
                {
                    sqliteCommand.Parameters.Add(new SQLiteParameter("@email", email));

                    try
                    {
                        using (SQLiteDataReader sqliteDataReader = sqliteCommand.ExecuteReader())
                        {
                            while (sqliteDataReader.Read())
                            {
                                string userPassword = (string)sqliteDataReader["Password"];
                                password = StrUtils.Hash(string.Format("{0}:{1}:{2}", email, password, configReader.GetString("Realm")));

                                if (password == userPassword)
                                {
                                    

                                    sqliteDataReader.Close();
                                    sqliteConnection.Close();

                                    return true;
                                }
                                else
                                {
                                    sqliteDataReader.Close();
                                    sqliteConnection.Close();

                                    return false;
                                }
                            }

                            sqliteConnection.Close();
                        }
                    }
                    catch (Exception ex)
                    {
                        sqliteConnection.Close();
                        return false;
                    }
                }
            }
            return false;
        }
    }
}
