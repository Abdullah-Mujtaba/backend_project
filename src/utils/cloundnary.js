// we are thinking in this way that the file is already on the local server
//also want to remove the file after it is uploaded

import {v2 as cloudinary} from "cloudinary"
import fs from "fs" 
//filesystem to handle/manipulate files



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
        console.log("File is uploaded on cloudinary ", response.url);
        return response
    } 
    catch (error) 
    {
        fs.unlinkSync(filePath) //remove the file that was saved on the server
        return null
    }
}


export {uploadOnCloundinary}






