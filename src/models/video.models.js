import mongoose, {Schema} from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';




const videoSchema = new Schema({
    
    videoFile:
    {
        type: String, //url of cloundary
        required: true
    },

    thumbnail:
    {
        type: String, //cloundnary url
        required: true
    },
    
    title:
    {
        type:String,
        required:true
    },

    description:
    {
        type: String, 
        required: true
    },

    duration:
    {
        type: Number, //cloudnary url
        required:true
    },

    views:
    {
        type: Number,
        default: 0
    },

    isPublic:
    {
        type: Boolean,
        default: true
    },

    owner:
    {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }


},{timestamps:true})
 


export const Video = mongoose.model("Video", videoSchema)