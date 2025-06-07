import mongoose, {Schema} from 'mongoose';



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
    fullname:
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








export const User = mongoose.model('User', userSchema)
