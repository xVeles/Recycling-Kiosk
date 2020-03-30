using Recycling_Kiosk.Objects;
using Recycling_Kiosk.Utils;
using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Device.Location;
using System.Net;
using System.Web.Mvc;

namespace Recycling_Kiosk.Controllers
{
    public class KioskController : Controller
    {
        [HttpGet]
        public ActionResult Kiosks()
        {
            using (SQLiteConnection sqliteConnection = DBConnecter.DBConnect())
            {
                
                using (SQLiteCommand sqliteCommand = new SQLiteCommand("SELECT * FROM Kiosk", sqliteConnection))
                {
                    
                    try
                    {
                        using (SQLiteDataReader sqliteDataReader = sqliteCommand.ExecuteReader())
                        {
                            
                            List<Kiosk> kiosks = new List<Kiosk>();
                            while (sqliteDataReader.Read())
                            {

                                Kiosk kiosk = new Kiosk()
                                {
                                    Name = (string)sqliteDataReader["Name"],
                                    Longitude = (double)sqliteDataReader["Longitude"],
                                    Latitude = (double)sqliteDataReader["Latitude"],
                                    Address = (string)sqliteDataReader["Address"],
                                    KioskType = (string)sqliteDataReader["Type"]
                                };
                                
                                kiosks.Add(kiosk);
                            }

                            sqliteConnection.Close();

                            return new JsonResult
                            {
                                Data = kiosks,
                                JsonRequestBehavior = JsonRequestBehavior.AllowGet
                            };
                        }

                    }
                    catch (Exception ex)
                    {
                        sqliteConnection.Close();

                        return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, "Internal Server Error: DB Insert fail - " + ex.ToString());
                    }

                }
            }
        }

        [HttpGet]
        public ActionResult Search(Kiosk location)
        {
            
            using (SQLiteConnection sqliteConnection = DBConnecter.DBConnect())
            {
                using (SQLiteCommand sqliteCommand = new SQLiteCommand("SELECT * FROM Kiosk", sqliteConnection))
                {
                    try
                    {
                        using (SQLiteDataReader sqliteDataReader = sqliteCommand.ExecuteReader())
                        {
                            List<Kiosk> kiosks = new List<Kiosk>();
                            while (sqliteDataReader.Read())
                            {
                                Kiosk kiosk = new Kiosk()
                                {
                                    Name = (string)sqliteDataReader["Name"],
                                    Longitude = (double)sqliteDataReader["Longitude"],
                                    Latitude = (double)sqliteDataReader["Latitude"],
                                    Address = (string)sqliteDataReader["Address"],
                                    KioskType = (string)sqliteDataReader["Type"]
                                };

                                kiosks.Add(kiosk);
                            }

                            sqliteConnection.Close();

                            List<Kiosk> closeKiosks = kiosks.FindAll(k =>
                            {
                                Console.WriteLine(k.Longitude);
                                Console.WriteLine(k.Latitude);
                                var sCoord = new GeoCoordinate(location.Latitude, k.Longitude);
                                var eCoord = new GeoCoordinate(k.Latitude, location.Longitude);

                                k.Distance = sCoord.GetDistanceTo(eCoord) / 1000.0;

                                Console.WriteLine(k.Distance);

                                if (k.Distance <= location.Distance) return true;
                                else return false;
                            });

                            if (closeKiosks.Count == 0)
                                return new HttpStatusCodeResult(HttpStatusCode.OK);
                            else
                                return new JsonResult
                                {
                                    Data = closeKiosks,
                                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                                };
                        }

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