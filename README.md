

# Recycling-Kiosk
RDA's WebAPI for 399

WebAPI Version: 1.2.1.1862

Readme Version: 1.2.1.1862

## Table of Contents
- [Hosting](#Hosting--Starting-Web-App)
- [Users](#Users)
    - [Users - Login](#Login---GET)
    - [Users - Register](#Register---POST)
    - [Users - Update](#Update---POST)
- [Kiosks](#Kiosk)
    - [Kiosks - Kiosks](#Kiosks---GET)
    - [Kiosks - Search](#Search---GET)


### Hosting & Starting Web App
**Windows Hosting**

Required to use **IISExpress** to host Web API in PowerShell

E.G *& "C:\Program Files\IIS Express\IISExpress.exe" /port:8189 /path:D:\Documents\ComSci399*

Required to modify Web.config and modify "DataRoot" field to match the path used in the the command

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

*Note: Points may get removed in future versions*

### Login - *GET*
| Info  | Description |
| ------ | ------ |
| Usage | Used to login |
| GET URL | localhost:####/users/login |
| Body Content | *User* data structure - *Email* & *Password* req |
| Successful Login | *OK Status* (Code 200) with *User* class with info |
| Unsuccessful Login | *BadRequest* (Code 400) with error message body content |

*Returned content on successful login does not include password field as it would be the MD5Hashed version*
*Front end Web app required to do email format verification,*

### Register - *POST*
| Info  | Description |
| ------ | ------ |
| Usage | Used to register a new user |
| POST URL | *localhost:####/users/register* |
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
| POST URL | *localhost:####/users/update* |
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

### Kiosks - GET
| Info  | Description |
| ------ | ------ |
| Usage | Fetchs entire list of kiosks in database |
| POST URL | *localhost:####/kiosk/kiosk* |
| Body Content | Nothing |
| Successful Fetech | *OK Status* (Code 200) with successful message body content |

### Search - GET
| Info  | Description |
| ------ | ------------ |
| Usage | Searches for kiosks within the *Distance* from provided location |
| POST URL | *localhost:####/kiosk/search* |
| Body Content | *Kiosk* data structure - *Longitude*, *Latitude*, *Distance* req |
| Successful Fetech | *OK Status* (Code 200) with successful message body content |

*Note: Body Content maybe empty if there are no Kiosks within the Distance range*
*Body Content is returned as a list of Kiosks within the set Distance. Units is in km (Lots of decimals)*
