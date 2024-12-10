const logger = require('../logger/logging.js');
const UserModel = require("../models/UserModel");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function checkPassword(request, response) {
    try {
        const { password, userId } = request.body;
        logger.info(`Validating password for userId: ${userId}`);

        const user = await UserModel.findById(userId);
        if (!user) {
            logger.error(`User not found for userId: ${userId}`);
            return response.status(400).json({
                message: "Invalid user ID",
                error: true
            });
        }

        const verifyPassword = await bcryptjs.compare(password, user.password);
        if (!verifyPassword) {
            logger.error(`Invalid password for userId: ${userId}`);
            return response.status(400).json({
                message: "Please check password",
                error: true
            });
        }

        logger.info(`Password validation successful for userId: ${userId}`);
        const tokenData = { id: user._id, email: user.email };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        logger.info(`JWT token generated successfully for userId: ${userId}`);
        const cookieOptions = { http: true, secure: true, sameSite: 'None' };

        logger.info(`Setting cookie 'token' for userId: ${userId}`);
        return response.cookie('token', token, cookieOptions).status(200).json({
            message: "Login successful",
            token,
            success: true
        });
    } catch (error) {
        logger.error(`Error in checkPassword: ${error.message}`);
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = checkPassword;
