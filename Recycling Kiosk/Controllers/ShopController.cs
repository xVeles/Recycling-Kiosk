using Recycling_Kiosk.Modules;
using Recycling_Kiosk.Objects;
using Recycling_Kiosk.Utils;
using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Recycling_Kiosk.Controllers
{
    public class ShopController : ApiController
    {

        [Route("api/shop/list")]
        [HttpGet]
        public HttpResponseMessage ShopList()
        {
            using (SQLiteConnection sqliteConnection = DBConnecter.DBConnect())
            {
                using (SQLiteCommand sqliteCommand = new SQLiteCommand("SELECT * FROM ShopItems", sqliteConnection))
                {
                    try
                    {
                        using (SQLiteDataReader sqliteDataReader = sqliteCommand.ExecuteReader())
                        {
                            List<ShopItem> shopItems = new List<ShopItem>();

                            while (sqliteDataReader.Read())
                            {
                                ShopItem item = new ShopItem()
                                {
                                    ProductID = (string)sqliteDataReader["ProductID"],
                                    Name = (string)sqliteDataReader["Name"],
                                    Description = (string)sqliteDataReader["Description"],
                                    Stock = Convert.ToInt16(sqliteDataReader["Stock"]),
                                    CategoryID = Convert.ToInt16(sqliteDataReader["CategoryID"]),
                                    Price = (double)sqliteDataReader["Price"],
                                    ShopImg = (string)sqliteDataReader["ShopImg"],
                                    Size = (string)sqliteDataReader["Size"]
                                };

                                shopItems.Add(item);
                            }

                            sqliteDataReader.Close();
                            sqliteConnection.Close();

                            return Request.CreateResponse(HttpStatusCode.OK, shopItems);
                        }
                    }
                    catch (Exception ex)
                    {
                        sqliteConnection.Close();

                        return Request.CreateResponse(HttpStatusCode.InternalServerError, "Internal Server Error: DB Selecet fail - " + ex.ToString());
                    }
                }
            }
        }

        [Route("api/shop/category")]
        [HttpGet]
        public HttpResponseMessage GetCategoryItems([FromUri] string category)
        {
            
            using (SQLiteConnection sqliteConnection = DBConnecter.DBConnect())
            {
                using (SQLiteCommand sqliteCommand = new SQLiteCommand("SELECT * FROM ShopItems INNER JOIN ShopCategory on ShopItems.CategoryID = ShopCategory.ID WHERE ShopCategory.Name = @type", sqliteConnection))
                {
                    sqliteCommand.Parameters.Add(new SQLiteParameter("@type", StrUtils.Sanitize(category)));

                    try
                    {
                        using (SQLiteDataReader sqliteDataReader = sqliteCommand.ExecuteReader())
                        {
                            List<ShopItem> shopItems = new List<ShopItem>();

                            while (sqliteDataReader.Read())
                            {
                                ShopItem item = new ShopItem()
                                {
                                    ProductID = (string)sqliteDataReader["ProductID"],
                                    Name = (string)sqliteDataReader["Name"],
                                    Description = (string)sqliteDataReader["Description"],
                                    Stock = Convert.ToInt16(sqliteDataReader["Stock"]),
                                    CategoryID = Convert.ToInt16(sqliteDataReader["CategoryID"]),
                                    Price = (double)sqliteDataReader["Price"],
                                    ShopImg = (string)sqliteDataReader["ShopImg"]
                                };

                                shopItems.Add(item);
                            }

                            sqliteDataReader.Close();
                            sqliteConnection.Close();

                            return Request.CreateResponse(HttpStatusCode.OK, shopItems);
                        }
                    }
                    catch (Exception ex)
                    {
                        sqliteConnection.Close();

                        return Request.CreateResponse(HttpStatusCode.InternalServerError, "Internal Server Error: DB Selecet fail - " + ex.ToString());
                    }
                }
            }
        }

        [Route("api/shop/search")]
        [HttpGet]
        public HttpResponseMessage Search([FromUri] string term)
        {
            using (SQLiteConnection sqliteConnection = DBConnecter.DBConnect())
            {
                using (SQLiteCommand sqliteCommand = new SQLiteCommand("SELECT * FROM ShopItems WHERE Name LIKE '%'|| @type ||'%'", sqliteConnection))
                {
                    sqliteCommand.Parameters.Add(new SQLiteParameter("@type", StrUtils.Sanitize(term)));

                    try
                    {
                        using (SQLiteDataReader sqliteDataReader = sqliteCommand.ExecuteReader())
                        {
                            List<ShopItem> shopItems = new List<ShopItem>();

                            while (sqliteDataReader.Read())
                            {
                                ShopItem item = new ShopItem()
                                {
                                    ProductID = (string)sqliteDataReader["ProductID"],
                                    Name = (string)sqliteDataReader["Name"],
                                    Description = (string)sqliteDataReader["Description"],
                                    Stock = Convert.ToInt16(sqliteDataReader["Stock"]),
                                    CategoryID = Convert.ToInt16(sqliteDataReader["CategoryID"]),
                                    Price = (double)sqliteDataReader["Price"],
                                    ShopImg = (string)sqliteDataReader["ShopImg"]   
                                };

                                shopItems.Add(item);
                            }

                            sqliteDataReader.Close();
                            sqliteConnection.Close();

                            return Request.CreateResponse(HttpStatusCode.OK, shopItems);
                        }
                    }
                    catch (Exception ex)
                    {
                        sqliteConnection.Close();

                        return Request.CreateResponse(HttpStatusCode.InternalServerError, "Internal Server Error: DB Selecet fail - " + ex.ToString());
                    }
                }
            }
        }

        [BasicAuthentication]
        [Route("api/shop/buy")]
        [HttpPost]
        public HttpResponseMessage Purchase([FromBody] PurchasedItem item)
        {
            using (SQLiteConnection sqliteConnection = DBConnecter.DBConnect())
            {
                using (SQLiteCommand sqliteInsertCommand = new SQLiteCommand("INSERT INTO ShopPurchases (UserEmail, ShopProductID, Quantity, Cost, DatePurchased) VALUES (@email, @productID, @quantity, @cost, @date)", sqliteConnection))
                {
                    sqliteInsertCommand.Parameters.Add(new SQLiteParameter("@email", item.Email));
                    sqliteInsertCommand.Parameters.Add(new SQLiteParameter("@productID", item.ProductID));
                    sqliteInsertCommand.Parameters.Add(new SQLiteParameter("@quantity", item.Quantity));
                    sqliteInsertCommand.Parameters.Add(new SQLiteParameter("@cost", item.Price));
                    sqliteInsertCommand.Parameters.Add(new SQLiteParameter("@date", DateTime.Now));

                    try
                    {
                        sqliteInsertCommand.ExecuteNonQuery();
                    }
                    catch (Exception ex)
                    {
                        sqliteConnection.Close();

                        return Request.CreateResponse(HttpStatusCode.InternalServerError, "Internal Server Error: DB Insert fail - " + ex.ToString());
                    }
                }

                using (SQLiteCommand sqliteUpdateCommand = new SQLiteCommand("UPDATE ShopItems SET Stock = (SELECT Stock FROM ShopItems WHERE ProductID = @productID) - @quantity WHERE ProductID = @productID", sqliteConnection))
                {
                    sqliteUpdateCommand.Parameters.Add(new SQLiteParameter("@productID", item.ProductID));
                    sqliteUpdateCommand.Parameters.Add(new SQLiteParameter("@productID", item.ProductID));
                    sqliteUpdateCommand.Parameters.Add(new SQLiteParameter("@quantity", item.Quantity));

                    try
                    {
                        sqliteUpdateCommand.ExecuteNonQuery();

                        sqliteConnection.Close();

                        return Request.CreateResponse(HttpStatusCode.OK, "Items purchased");
                    }
                    catch (Exception ex)
                    {
                        sqliteConnection.Close();

                        return Request.CreateResponse(HttpStatusCode.InternalServerError, "Internal Server Error: DB Update fail - " + ex.ToString());
                    }
                }
            }
        }
    }
}