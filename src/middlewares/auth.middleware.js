import { asyncHandler } from "../utils/asyncHandler";










export const verifyJWT = asyncHandler(async(req,res,next)=>
{
    //req.cookies //now we have all the cookies
    req.cookies?.accessToken || req.header("Authorization")?
})