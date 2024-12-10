const logger = require('../logger/logging.js');
const UserModel = require("../models/UserModel");
const bcryptjs = require('bcryptjs');

async function registerUser(request, response) {
    try {
        const { name, email, password, profile_pic } = request.body;
        logger.info(`Registering user with email: ${email}`);

        const checkEmail = await UserModel.findOne({ email });
        if (checkEmail) {
            logger.error(`User registration failed: Email already exists - ${email}`);
            return response.status(400).json({
                message: "User already exists",
                error: true,
            });
        }

        logger.info(`Hashing password for email: ${email}`);
        const salt = await bcryptjs.genSalt(10);
        const hashpassword = await bcryptjs.hash(password, salt);

        const payload = {
            name,
            email,
            profile_pic,
            password: hashpassword
        };

        const user = new UserModel(payload);
        const userSave = await user.save();
        logger.info(`User created successfully with email: ${email}`);

        return response.status(201).json({
            message: "User created successfully",
            data: userSave,
            success: true
        });

    } catch (error) {
        logger.error(`Error in registerUser: ${error.message}`);
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = registerUser;
