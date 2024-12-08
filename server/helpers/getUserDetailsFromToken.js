const jwt = require('jsonwebtoken')
const UserModel = require('../models/UserModel')

// const waitForToken = async (checkFn, timeout, interval) => {
//     const start = Date.now();
//     while (Date.now() - start < timeout) {
//         const token = checkFn();
//         if (token) return token;
//         await new Promise(resolve => setTimeout(resolve, interval)); // Wait for `interval` ms
//     }
//     return null; // Timeout exceeded
// };

const getUserDetailsFromToken = async(token)=>{
    // console.log("jwtkey1",token) 

    // token = await waitForToken(() => token, 20000, 500);

    if(!token){
        return {
            message : "session out",
            logout : true,
        }
    }
    // console.log(process.env.JWT_SECRET_KEY)
    const decode = await jwt.verify(token,process.env.JWT_SECRET_KEY)
    
    const user = await UserModel.findById(decode.id).select('-password')
    // console.log("ferogo",user)
    return user
}

module.exports = getUserDetailsFromToken