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


//cant use app.get because now we have sepeprated routers and controllers if we were using the normal
//approach app.get that would make us use router and controller in the same function

//routes import
import userRouter from './routes/user.routes.js'
//→ You are importing that default export → the router object → and assigning it the name userRouter in this file.

//👉 The name userRouter does not have to match the name router in the other file — you can choose any name when importing a default export

//routes declaration
app.use("/api/v1/users",userRouter)
//how this works is that when the user hits the url
//it gives the controller to userRouter which was imported from routes so it goes inside that file
////http://localhost:8000/api/v1/users/register this is what becomes

//note: that once we do this we dont have to import it again and again we dont have to bother
//with app.use again and again 



export {app}
