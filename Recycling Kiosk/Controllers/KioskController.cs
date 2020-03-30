using Recycling_Kiosk.Utils;
using System;
using System.Collections.Generic;
using System.Data.SQLite;
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
                                    Address = (string)sqliteDataReader["Address"]
                                };

                                kiosks.Add(kiosk);
                            }

                            sqliteConnection.Close();

                            return new JsonResult
                            {
                                Data = kiosks
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
                                    Address = (string)sqliteDataReader["Address"]
                                };

                                kiosks.Add(kiosk);
                            }

                            sqliteConnection.Close();

                            List<Kiosk> closeKiosks = kiosks.FindAll(k =>
                            {
                                double theta = location.Longitude - k.Longitude;

                                double dist = Math.Sin(Deg2rad(location.Latitude))
                                * Math.Sin(Deg2rad(k.Latitude))
                                + Math.Cos(Deg2rad(location.Latitude))
                                * Math.Cos(Deg2rad(k.Latitude))
                                * Math.Cos(Deg2rad(theta));

                                dist = (Rad2deg(Math.Acos(dist))) * 60 * 1.1515;
                                dist *= 1.609344;

                                k.Distance = dist;

                                if (dist < 20.0) return true;
                                else return false;
                            });

                            if (closeKiosks.Count == 0)
                                return new HttpStatusCodeResult(HttpStatusCode.OK);
                            else
                                return new JsonResult
                                {
                                    Data = closeKiosks
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

        private double Deg2rad(double degree) => degree * Math.PI / 180.0;
        private double Rad2deg(double radian) => radian / Math.PI * 180.0;
    }
}