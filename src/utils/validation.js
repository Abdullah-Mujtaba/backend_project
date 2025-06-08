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

const userExists = function(username,email)
{
    const message = User.findOne({
        $or: [{email},{username}]
    })
    if(message)
    {
        return "User with the same email or username already exists"
    }
}


export {validateFields, userExists}