const UserModel = require("../models/UserModel")
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function checkPassword(request,response){
    try {
        const { password, userId } = request.body

        const user = await UserModel.findById(userId)
        // console.log(user)
        const verifyPassword = await bcryptjs.compare(password,user.password)
        // console.log("verifypass",verifyPassword)
        if(!verifyPassword){
            return response.status(400).json({
                message : "Please check password",
                error : true
            })
        }

        const tokenData = {
            id : user._id,
            email : user.email 
        }
        // console.log("jwtkey",process.env.JWT_SECRET_KEY)
        const token = await jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{ expiresIn : '1d'})
        // console.log("tdata",tokenData)
        // console.log("token",token)
        const cookieOptions = {
            http : true,
            secure : true,
            sameSite : 'None'
        }

        return response.cookie('token',token,cookieOptions).status(200).json({
            message : "Login successfull",
            token : token,
            success :true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = checkPassword