// we are thinking in this way that the file is already on the local server
//also want to remove the file after it is uploaded

import {v2 as cloudinary} from "cloudinary"
import fs from "fs" 
//filesystem to handle/manipulate files


//we were missing this that is why we were facing an error that must provide API KEY
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadOnCloundinary = async (filePath) =>
{
    try 
    {
        if(!filePath)
        {
            console.log("File path is not valid")
            return null
        }    
            //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(filePath,
        {
                resource_type:"auto"
        })
        //file uploaded 
        //console.log("File is uploaded on cloudinary ", response.url);
        fs.unlinkSync(filePath) //using unlinkSync because we want to remove this and then move forward
        return response
    } 
    catch (error) 
    {
        console.log(error)
        fs.unlinkSync(filePath) //remove the file that was saved on the server
        return null
    }
}


export {uploadOnCloundinary}






