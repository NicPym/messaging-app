# messaging-app

Messaging App for BBD Grad Program

## Server

### Auth on server

Auth implemented with jwt. Can get google plugin for it but for now needs Authorization header and a bearer + token as a value.

### Syncing DB

In the index.js file on the backend, there is a line that is commented out -> sync ({alter:true}) uncomment this line and comment out the line after it (sync()). Then create a db called `database_development`. Run the server and your db will populate.
