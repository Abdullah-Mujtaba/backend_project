import {Router} from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()


//to use middleware we integrate it before a function here before calling the register
//function we are using a middleware uploads to store the uploaded files that the user enters in the
//fields
router.route("/register").post(
    upload.fields([
        {
            name: "avatar", //name of this has to be same in the frontend
            maxCount:1 //telling that only one file we will take
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

//here is my take, data from postman or wtv will be handled by the middleware first then
//handled by the function that I have called

export default router