//const asyncHandler = () => {} this is how we use an arrow function normally
//const asyncHandler = (fn) => () => {} //think of it as this that we have passed a function inside
//a high order function and to executet that function we use this syntax
//to make that this whole process async so we dont get blocked
// const asyncHandler =  (func) => async () => {} note that async comes before the second ()
//because the function that we passed we want to execute that in a asyncnorous manner



//we used next because we might be using middlewares
const asyncHandler = (func) => async (req,res,next) => {
    try {
        await func(req,res,next)
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
        
    }
}

export {asyncHandler}

//another way of doing the same thing with the usage of promises 
/*
    const asyncHandler = (requestHandler) => {
        (req,res,next)=> {
            Promise.resolve(requestHandler(req,res,next)).
            catch((err)=> next(err))}}
*/