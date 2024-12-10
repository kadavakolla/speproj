const logger = require('../logger/logging.js');
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function userDetails(request, response) {
    try {
        const authHeader = request.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // 'Bearer <token>'

        if (!token) {
            logger.error("Token not provided in request");
            return response.status(403).json({
                message: "Token not provided",
                error: true
            });
        }

        logger.info(`Token received: ${token}`);
        const user = await getUserDetailsFromToken(token);

        logger.info(`User details fetched successfully for userId: ${user.id}`);
        return response.status(200).json({
            message: "User details retrieved",
            data: user
        });
    } catch (error) {
        logger.error(`Error in userDetails: ${error.message}`);
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = userDetails;
