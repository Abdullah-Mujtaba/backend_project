import {Router} from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
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

router.route("/login").post(loginUser) //run loginUser when this url is hit


//secured routers
router.route("/logout").post(
    verifyJWT, logoutUser //this is how we use the middleware that we have made
    //the next helps in executing logoutUser that is why we wrote next() in the end
    //in middlewares that we have made we just pass the reference
)

router.route("/refresh-token").post(refreshAccessToken)

export default router