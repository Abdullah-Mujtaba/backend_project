import {User} from "../models/user.models.js"

const validateFields = function(fullName, email, username, password)
{
    if(fullName === "")
    {
        return "The fullName is not valid"
    }
    if(email == "")
    {
        return "the email is not valid"
    }
    if(username == "")
    {
        return "the username is not valid"
    }
    if(password == "")
    {
        return "the passowrd is not valid"
    }
}

//forgot to add await in User.findOne that is why it was not working and returning nothing


//the parameters must be in the same order when calling the function otherwise we will get an error the db query wont run properly
const userExists = async function(username,email)
{
    const message = await User.findOne({
        $or: [{username},{email}]
    })
    
    return "User with the same username and email exists"

}


export {validateFields, userExists}