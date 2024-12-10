const logger = require('../logger/logging.js');
const UserModel = require("../models/UserModel");

async function checkEmail(request, response) {
    try {
        const { email } = request.body;
        logger.info(`Received request to check email: ${email}`);

        const checkEmail = await UserModel.findOne({ email }).select("-password");
        if (!checkEmail) {
            logger.error(`Email not found in database: ${email}`);
            return response.status(400).json({
                message: "User does not exist",
                error: true
            });
        }

        logger.info(`Email found in database: ${email}`);
        return response.status(200).json({
            message: "Email verified",
            success: true,
            data: checkEmail
        });
    } catch (error) {
        logger.error(`Error in checkEmail: ${error.message}`);
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = checkEmail;
