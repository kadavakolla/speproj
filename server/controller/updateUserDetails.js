const logger = require('../logger/logging.js');
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");

async function updateUserDetails(request, response) {
    try {
        const token = request.cookies.token || "";
        logger.info("Fetching user details from token");

        const user = await getUserDetailsFromToken(token);
        if (!user) {
            logger.error("User not found from token");
            return response.status(401).json({
                message: "Unauthorized access",
                error: true
            });
        }

        const { name, profile_pic } = request.body;
        logger.info(`Updating user details for userId: ${user._id}`);

        await UserModel.updateOne({ _id: user._id }, {
            name,
            profile_pic
        });

        const userInformation = await UserModel.findById(user._id);
        logger.info(`User details updated successfully for userId: ${user._id}`);

        return response.json({
            message: "User updated successfully",
            data: userInformation,
            success: true
        });

    } catch (error) {
        logger.error(`Error in updateUserDetails: ${error.message}`);
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = updateUserDetails;
