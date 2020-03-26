

# Recycling-Kiosk
RDA's WebAPI for 399

WebAPI Version: 1.1.8.1262

Readme Version: 1.1.8.1262

### Hosting/Starting Web App
**Windows Hosting**

Required to use **IISExpress** to host Web API in PowerShell

E.G *& "C:\Program Files\IIS Express\IISExpress.exe" /port:8189 /path:D:\Documents\ComSci399*

Required to modify Web.config and modify "DataRoot" field to match the path used in the the command

## Users
### Data Structure
Data Structure for *User* Class
| Field Name | Field Type|
| :---: | :---: |
| Username | String |
| Firstname | String |
| Lastname | String |
| Password | String |
| Email | String |
| Points | Int |

*Note: Points may get removed in future versions*

# HTTP Requests for Users
### Login - *GET*
| Info  | Description |
| ------ | ------ |
| GET URL | localhost:####/users/login |
| Body Content | *User* data structure - *Email* & *Password* req |
| Successful Login | *OK Status* (Code 200) with *User* class with info |
| Unsuccessful Login | *Bad Request* (Code 400) with error message |

*Returned content on successful login does not include password field as it would be the MD5Hashed version*
*Front end Web app required to do email format verification,*

### Register - *POST*
| Info  | Description |
| ------ | ------ |
| POST URL | *localhost:####/users/register* |
| Body Content |  *User* data structure - all fields req |
| Successful Register | *OK Status* (Code 200) with successful message  |
| Unsuccessful Register | *Bad Request* (Code 400) with error message  |

*Front end Web App required to do field verification (WebAPI will do Username/Email check)*
*BadRequest gets returned if one of the following requirements is met:*
- Username already taken
- Email already taken

### Update - *POST*
| Info  | Description |
| ------ | ------ |
| POST URL | *localhost:####/users/update* |
| Body Content |  *User* data structure - all fields req |
| Successful Update | *OK Status* (Code 200) with successful message |
| Unsuccessful Update | *BadRequest* (Code 400) with error message |

*Username cannot be changed*
*If BadRequest is returned it is probably due to the new email already existing in the database*
