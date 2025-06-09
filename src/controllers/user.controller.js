import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { validateFields } from "../utils/validation.js";
import { userExists } from "../utils/validation.js";
import {uploadOnCloundinary} from "../utils/cloundnary.js"
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const generateTokens = async function(userId)
{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false}) //what it means is that whenever we try to save
        //something in database it will kick in and ask for required fields again which we dont have
        //and dont have so to avoid that and only give it the field that we want to give
        //we use this

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}


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



const loginUser = asyncHandler(async(req,res)=>
{
    //look at the data that is coming,
    //if the user exists in db
    //password check
    //give him a accessToken
    //if it expires give him a refresh token
    //send cookies

    const {username, email,password} = req.body //the way we take data from the body
    if(!username && !email )
    {
        throw new ApiError(400,"username or email required")
    }

    //database in another continent will take time so use await
    //code stops here for the async function and wont run untill the data is returned
    const userData = await User.find({$or: [{username},{email}]}) //find if the user exists with the username or email
    if(!userData)
    {
        throw new ApiError(404, "User does not exist")
    }
    //the functions that we have defined can be ran by the userData not the User itself
    const isPasswordValid = await userData.isPasswordCorrect(password)
    //isPasswordValid will have a bool value
    if(!isPasswordValid)
    {
        throw new ApiError(401,"Invalid Password")
    }

    //whichever thing takes time use await for that 
    const {accessToken,refreshToken} = await generateTokens(userData._id)

    //have to see if database call is expensive or not
    const loggedInUser = await User.findById(userData._id).select("-password -refreshToken")
    //this gives everything apart from what we hvae told in the select field that do not
    //send password and refreshToken

    const options = 
    {
        httpOnly: true, //now the cookies can be only modified by the server and not the frontend
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken,options) //we can chain as many cookies we want 
    .json(
        new ApiResponse(200,
            {
                user: loggedInUser,accessToken,refreshToken
            }, "User logged in successfully")
    )

})


const logoutUser = asyncHandler(async(req,res)=>
{
    
})

//export const registerUser
export {registerUser} //this works
export {loginUser}

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