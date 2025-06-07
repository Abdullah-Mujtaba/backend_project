import dotenv from "dotenv" // we import this because we want the environment variables to be available to everyone as soon as possible 
// import express from "express"
import connectDB from "./db/index.js";
dotenv.config({
    path: './env'
})

//Error [ERR_UNSUPPORTED_DIR_IMPORT]: Directory import 'C:\backend_project\src\db' is not supported resolving ES modules imported from C:\backend_project\src\index.js
//when this happens look at the import statements

//***********READ THE ERRORS!! */


connectDB()
.then(()=>{app.listen(process.env.PORT || 8000, ()=>{
    console.log(`SERVER IS RUNNING AT : ${process.env.PORT}`)
})})
.catch((error)=>{console.log("DB CONNECTION FAILED", error)})


// const app = express()
// ( async () => {
//     try{

//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (error)=>
//             {
//                 console.log("Error", error);
//                 throw error
//             })        
//             app.listen(process.env.Port,() => {
//                 console.log(`App is listening on port ${process.env.PORT}`)
//             })
//     }catch(error)
//     {
//         console.error("ERROR: ", error)
//         throw err
//     }
// })()