# Recycling-Kiosk
RDA's WebAPI for 399

##Hosting/Starting Web App
*Windows Hosting*
Required to use **IISExpress** to host Web API in PowerShell
E.G *& "C:\Program Files\IIS Express\IISExpress.exe" /port:8189 /path:D:\Documents\ComSci399*
Required to modify Web.config and modify "DataRoot" field to match the path used in the the command

##Users
#Data Structure
Data Structure for *User* Class

**Username** (String)
**Firstname** (String)
**Lastname** (String)
**Password** (String)
**Email** (String)
**Points** (Int, Unsupported - May get removed)

#HTTP Requests for Users
#GET
To login use *localhost:####/api/users/*
Body content should contain a *User* data structure.
*Email* or *Username* and *Password* is required. (I.E You can either specify a username or email and their password to login)
Request returns OK Status (Code 200) with a *User* class containing all the info of the user.
Otherwise returns BadRequest (Code 400) with an error message body content.

#POST
To Register use *localhost:####/api/users/*
Body content should contain a *User* data structure.
All fields are required.
Local Web App will require an Email format verfication check.
Request returns OK Status (Code 200) with an successful message body content.
Otherwise returns BadRequest (Code 400) with error message body content if one of the following requirements is met:
- Username already taken
- Email already taken

