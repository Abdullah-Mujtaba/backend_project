import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { validateFields } from "../utils/validation.js";
import { userExists } from "../utils/validation.js";
import {uploadOnCloundinary} from "../utils/cloundnary.js"
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// usually 4 parameters error,req,res,next

//*************** FLOW FOR REGISTRATION************** */
//get data from the user
//validate the data that we get
//check if the user already exists
//check for images that have they uploaded avatars
//upload images to cloudinary
//create a user object and insert into db
//remove password and refresh token when sending response
//to frontend
//check for user creation
//return res
const registerUser =  asyncHandler(async (req,res) => 
{
    //this only contains data when coming from json or form
    //for url data we need to do something else
    //using postman to send data
    const {fullName, email, username, password} = req.body
  
    const errorMessage = validateFields(fullName,email,username,password)
    if(errorMessage)
    {
        throw new ApiError(404,errorMessage)
    }

    //the issue why the promise was pending because we did not call await and the function was not going forward was due to this
    const userExistance = await userExists(username,email) //the issue that I had was that i was passing the parameters in the wrong order resulting in mongoDB not returning anything
    console.log(userExistance)

    if(userExistance)
    {
        throw new ApiError(409,userExistance)
    }


    const avatarLocalPath = req.files?.avatar[0]?.path;
    //console.log(req.files)
    // const coverImageLocalPath= req.files?.coverImage[0]?.path //can cause issue because what we are saying is that once we get req.files if that exists then see if coverImage exists
    //because req.files is an object which returns arrays of with the field names that we have defined and inside them we have arrays, look at notes file
    //using simple if else we can resolve the issue
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0)
    {   
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath)
    {
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloundinary(avatarLocalPath)
    const coverImage = await uploadOnCloundinary(coverImageLocalPath)

    if(!avatar)
    {
        throw new ApiError(400, "Avatar is missing")    
    }

    const user = await User.create(
    {
        fullName,
        avatar: avatar.url, 
        coverImage: coverImage?.url || "",
        email, 
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser)
    {
        throw new ApiError(500, "Something went wrong when registering a new user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})


//export const registerUser
export {registerUser} //this works


/**
 * the reason was that we wrote const after export which meant that the statement
 * wanted something
 * we cannot export like this because this only works when we define and export
 * in the same line but since that is not the case we have to use the other syntax
 * which is 
 * export {registerUser}
 * 
 * 
 */