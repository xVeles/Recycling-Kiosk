

# Recycling-Kiosk
RDA's WebAPI for 399

WebAPI Version: 1.5.1.1024

Readme Version: 1.5.1.1024

## Table of Contents
- [Hosting](#Hosting--Starting-Web-App)
- [BasicAuthentication](#Basic-Authentication)
- [Users](#Users)
    - [Users - Login](#Login---GET)
    - [Users - Register](#Register---POST)
    - [Users - Update](#Update---POST)
- [Kiosks](#Kiosk)
    - [Kiosks - Kiosks](#Kiosks---GET)
    - [Kiosks - Search](#Search---GET)
- [Shops](#Shop)
    - [Shop - List](#List---get)
    - [Shop - Category](#Category---get)
    - [Shop - Search](#Search---get-1)
    - [Shop - Purchase](#Purchase---post)

### Hosting & Starting Web App
**Windows Hosting**

Required to use **IISExpress** to host Web API in PowerShell

E.G *& "C:\Program Files\IIS Express\IISExpress.exe" /port:8189 /path:D:\Documents\ComSci399*

Required to modify Web.config and modify "DataRoot" field to match the path used in the the command

## Basic Authentication
Some requests will have a \[BasicAuthentication\] tag. This indicates that when you are forming the XHR (XMLHttpRequest) request, you will need to declare it `withCredentials = true`

The credentials must be the user's login details, if you fail to provide or if the login details are incorrect the server will reply with a *Error - 401 Unauthorized*

## Users
### Data Structure
Data Structure for *User* Class
| Field Name | Field Type|
| ------ | ------ |
| Username | String |
| Firstname | String |
| Lastname | String |
| Password | String |
| Email | String |
| Points | Int |
| Recycle | Bool (Stored as  Int 1 or 0) |
| Upcycle | Bool (Stored as  Int 1 or 0) |
| Donate | Bool (Stored as  Int 1 or 0) |

*Note: Points may get removed in future versions*

*Recycle, Upcycle and Doante are all booleans (true/false) however are transfered as 1 (true) and 0 (false) due to the db storing them in this form. It's just easier to keep them in this form that constantly convert them in the code*

### Login - *GET*
| Info  | Description |
| ------ | ------ |
| Usage | Used to login |
| GET URL | localhost:####/api/users/login |
| [BasicAuthentication](#Basic-Authentication) | Required |
| Body Content | *User* data structure - *Email*  req |
| Successful Login | *OK Status* (Code 200) with *User* class with info |
| Unsuccessful Login | *BadRequest* (Code 400) with error message body content |

*Returned content on successful login does not include password field as it would be the MD5Hashed version*
*Front end Web app required to do email format verification,*

### Register - *POST*
| Info  | Description |
| ------ | ------ |
| Usage | Used to register a new user |
| POST URL | *localhost:####/api/users/register* |
| Body Content |  *User* data structure - all fields req |
| Successful Register | *OK Status* (Code 200) with successful message body content |
| Unsuccessful Register | *BadRequest* (Code 400) with error message body content |

*Front end Web App required to do field verification (WebAPI will do Username/Email check)*
*BadRequest gets returned if one of the following requirements is met:*
- Username already taken
- Email already taken

### Update - *POST*
| Info  | Description |
| ------ | ------ |
| Usage | Used to update a users details |
| POST URL | *localhost:####/api/users/update* |
| [BasicAuthentication](#Basic-Authentication) | Required |
| Body Content |  *User* data structure - all fields req |
| Successful Register | *OK Status* (Code 200) with successful message body content |
| Unsuccessful Register | *BadRequest* (Code 400) with error message body content |

*Username cannot be changed
*If BadRequest is returned it is probably due to the new email already existing in the database

## Kiosk
### Data Structure
Data Structure for *Kiosk* Class
| Field Name | Field Type|
| ------ | ------ |
| Name | String |
| Longitude | Double |
| Latitude | Double |
| Address | String |
| Distance | Integer |
| Type | String |

*Note: Type can either be only one of the following*
- Recycle
- Upcycle
- Donate

### Kiosks - GET
| Info  | Description |
| ------ | ------ |
| Usage | Fetchs entire list of kiosks in database |
| POST URL | *localhost:####/api/kiosk/kiosk* |
| Body Content | Nothing |
| Successful Fetech | *OK Status* (Code 200) with successful message body content |

### Search - GET
| Info  | Description |
| ------ | ------------ |
| Usage | Searches for kiosks within the *Distance* from provided location |
| POST URL | *localhost:####/api/kiosk/search* |
| Body Content | *Kiosk* data structure - *Longitude*, *Latitude*, *Distance* req |
| Successful Fetech | *OK Status* (Code 200) with successful message body content |

*Note: Body Content maybe empty if there are no Kiosks within the Distance range*
*Body Content is returned as a list of Kiosks within the set Distance. Units is in km (Lots of decimals)*

## Shop
### ShopItem Data Structure
Data Structure for *ShopItem* Class
| Field Name | Field Type|
| ------ | ------ |
| ProductID | String |
| Name | String |
| Description | String |
| Stock | Integer |
| Price | Double |

*Note: This class is used for individual items (When listing what items can be bought from the store)*

### PurchasedItem Data Strcuture
Data Structure for *PurchasedItem* Class
| Field Name | Field Type|
| ------ | ------ |
| Email | String |
| ProductID | String |
| Quantity | Integer |
| Price | Double |

*Note: This class is used for when purchasing an item*

*Email is the email of the person that wants to purchase an item*

*Price is total price (Quantity x Product Price)*

### List - *GET*
| Info  | Description |
| ------ | ------ |
| Usage | Fetchs entire list of shop items in database |
| POST URL | *localhost:####/api/shop/list* |
| Body Content | Nothing |
| Successful Get | *OK Status* (Code 200) with successful message body content |

*Note: Returns a list of ShopItems*

### Category - *GET*
| Info  | Description |
| ------ | ------ |
| Usage | Fetchs entire list of shop items in database that has matches a certain category |
| POST URL | *localhost:####/api/shop/category?category=* |
| URI Content | Category that you want to search for |
| Successful Get | *OK Status* (Code 200) with successful message body content |

*Note: Category has specific values that it searches for:*
- Tops
- Pants
- Jackets
- Socks
- Accessories

### Search - *GET*
| Info  | Description |
| ------ | ------ |
| Usage | Fetchs entire list of shop items in database that has matches a certain category |
| POST URL | *localhost:####/api/shop/search?term=* |
| URI Content | Category that you want to search for |
| Successful Get | *OK Status* (Code 200) with successful message body content |

*Note: Search is based off product name*

### Purchase - *POST*
| Info  | Description |
| ------ | ------ |
| Usage | Used to purchase items from the store |
| POST URL | *localhost:####/api/shop/buy* |
| [BasicAuthentication](#Basic-Authentication) | Required |
| Body Content | *PurchasedItem* data structure - all fields req |
| Successful Post | *OK Status* (Code 200) with successful message body content |

*Note: Wanting to buy multiple items requires multiple requests. One item per request.*
