const jwt = require('jsonwebtoken')
const UserModel = require('../models/UserModel')

const getUserDetailsFromToken = async(token)=>{
    console.log("jwtkey1",token)
    if(!token){
        return {
            message : "session out",
            logout : true,
        }
    }
    // console.log(process.env.JWT_SECRET_KEY)
    const decode = await jwt.verify(token,process.env.JWT_SECRET_KEY)
    console.log("jwtkey",process.env.JWT_SECRET_KEY)
    const user = await UserModel.findById(decode.id).select('-password')
    console.log("ferogo",user)
    return user
}

module.exports = getUserDetailsFromToken