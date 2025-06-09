import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.models.js"






//middleware we are writing so we have to add next to pass on to the next middleware or anything that executes next
export const verifyJWT = asyncHandler(async(req,_,next)=> //because the response was not being used so we wrote _ in that place
{
    try {
        //req.cookies //now we have all the cookies
        //req has cookie access becuase we used app.use(cookie) in the app.js file
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","") //if we see bearer replace that with empty string so we
        //can get our accessToken
        //we are checking this becuase what if there is a mobile application user and 
        //  is sending a custom heaader so we have to check that as well so using
        //req.heaader
        //note that it is possible that accessToken is not cookie so we have used req.cookies?. 
    
        if(!token)
        {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken") //we can do this because when the token is decoded and returned we have put id in it 
        //look at user.models.js to see what the accessToken has when it returns
    
        if(!user)
        {
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user; //adding another object user to the request so when we use this middleware, and try to execute logout function
        //the request would have an object user with the userID so we can logout the user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
        
    }

})