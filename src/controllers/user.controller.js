import {asyncHandler} from "../utils/asyncHandler.js";


// usually 4 parameters error,req,res,next
const registerUser =  asyncHandler(async (req,res) => 
    {
        res.status(200).json({
            message: "ok"
        })
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