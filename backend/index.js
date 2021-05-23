import app from './server.js';
import mongodb from 'mongodb';
import dotenv from 'dotenv'; //load in environment variables
import RestaurantsDAO from './dao/restaurantsDAO.js'
dotenv.config(); //configure .env


//get accesss to mongo client from mongo db
const MongoClient = mongodb.MongoClient;


//set up port
const port = process.env.PORT || 8000;

//connect to database
MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI,
    {
        poolSize: 50,
        wtimeout: 2500,
        useNewUrlParser: true }
    )
    .catch (err => {
        console.log(err.stack)
        process.exit(1)
    })
    .then(async client => {
        //this is how we get reference to the restaurants collection
        await RestaurantsDAO.injectDB(client)
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    });

