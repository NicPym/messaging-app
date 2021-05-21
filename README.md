# messaging-app

Messaging App (Chinese Whatsapp) for BBD Grad Program

## Auth on server

Auth implemented with jwt. Can get google plugin for it but for now needs Authorization header and a bearer + token as a value. Also remember to setup Google Auth on the Google Cloud Platform, and edit the credentials in the `.env` file of the server.

## Syncing DB

In the index.js file on the backend, there is a line that is commented out -> sync ({alter:true}) uncomment this line and comment out the line after it (sync()). Then create a db called `database_development` using mySQL. Run the server and your db will populate. Currently the db has been hosted on the Google Cloud Platform. If you are planning on using a local database, please edit the `sequelizeConfig.json` file in the `util` folder of the `server` folder.

## Running the Application

### Frontend

Start with the frontend by running `npm install` and then `npm run build`. This creates a build folder that the backend will serve.

### Backend

Start the backend by running `npm install` and `npm run dev`. This will serve both the frontend and the backend services. The application is served locally on port 8080.

## Deployment

The application is deployed to the Google Cloud Platform. The `cloud_build.yaml` specifies the scripts that need to be run before the app gets deployed. Also, our Google Cloud Platform app was setup with CI on the main branch.

## Team Members

- Stuart Barclay
- Shankar Dayal
- Nicholas Pym
- Lior Sinai
- Duncan Vodden
- Raymond Walters
