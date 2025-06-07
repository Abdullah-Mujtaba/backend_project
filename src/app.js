import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express()

//this is how we use cors so that we can enable backend and frontend that run on different urls
//and ports to communicate with each other

//since we are using middlewares we have used app.use()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({limit:'16kb'})) //we have done this because some users might enter data
// in a json format so and we have set a limit so that the server doesnt crash
app.use(express.urlencoded({extended: true, limit: "16kb"})) //added this because we want data from the url and sometimes
//data from the url is encoded in different ways so to understand that 
app.use(express.static("public")) //we have done this because we want to store some files and folders
//so we are telling the app that this where we want to save those, we are saving on the server
app.use(cookieParser())

export {app}
