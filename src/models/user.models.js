import mongoose, {Schema} from 'mongoose';
import jwt from 'jsonwebtoken';
import brcypt from  "bcrypt"


const userSchema = new Schema({
    username:
    {
        type: String,
        required: true,
        unique: true,
        lower: true,
        trim: true, //this removes whitespaces between words when saving in database
        index: true //what we learned in database it enables fast searching
    },
    email:
    {
        type:String,
        required:true,
        unique:true,
        lower:true,
        trim:true
    },
    fullName:
    {
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:
    {
        type:String, //cloudnary url
        required:true
    },
    coverImage:
    {
        type:String
    },
    
    watchHistory:
    {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }] //watchHistory: [ ObjectId, ObjectId, ObjectId, ... ] this is how it is shown 
    },

    password:
    {
        type:String,
        required: [true,"Password is required"]
    },

    refreshToken:
    {
        type: String
    }   

},{timestamps:true})


//pre is a function middleware basically which allows us to do something just before the data is saved
//into our database, right now what we are doing is that before the password is saved we want to
//encrypt it using brcypt.hash, 

//**note that we do not use arrow functions because they do not have the context of this
// the this.attribute knows what context we are talking about
// this.isModified checks if any value was changed, the value that we want to check is passed
// in the arguements
// because this is a middleware we have to pass the next flag inside the arguements of the 
// function and then return it or execute it
// *************
// because this is a lenghty process the hashing we make the function async function */
userSchema.pre("save", async function(next) {
    if(!this.isModified('password'))
    {
            return next()
    }
    this.password = brcypt.hash(this.password, 10)
    next()
})

//custom method if this does not exist then it will be added 
//here we are checking the password
//the parameter is the password we want to check, we check the password 
//with the encrypted password
userSchema.methods.isPasswordCorrect = async function(password)
{
    return await brcypt.compare(password, this.password)
}

//does not take that much time so we do not use async
userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET, //takes an object for expiry
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }    
)
}

//refresh token holds less data than the access token due to refreshing again and again
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
    {
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET, //takes an object for expiry
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }    
    )
}






export const User = mongoose.model('User', userSchema)
