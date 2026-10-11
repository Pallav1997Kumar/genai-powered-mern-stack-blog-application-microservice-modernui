const userService = require("../services/blog-user.service.js");

const handleError = require("../utils/error-handler.js");
const devLogger = require("../utils/dev-logger.js");

const FILE_NAME = "blog-user.controller.js";



// ============================================================
// Update User Profile Photo Starts
// ============================================================
async function updateUserProfilePhoto(req, res, next) {
    devLogger.info(`[${FILE_NAME}] Update user profile photo request received`);

    try {
        devLogger.info(`[${FILE_NAME}] Extracting user ID from request parameters`);
        const userID = req.params.userID;

        if (!userID) {
            devLogger.warn(`[${FILE_NAME}] Profile photo update request received without user ID`);
            throw {
                success: false,
                error: true,
                successMessage: "",
                errorMessage: "User ID is required",
                errorData: null,
                resultData: null,
                status: 400
            };
        }

        devLogger.info(`[${FILE_NAME}] Extracting profile photo request body`);
        const body = req.body;

        devLogger.info(`[${FILE_NAME}] Extracting authentication token from request headers`);
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        if (!token) {
            devLogger.warn(`[${FILE_NAME}] Logout request received without authentication token`);
            throw {
                success: false,
                error: true,
                successMessage: "",
                errorMessage: "Authentication token is required",
                errorData: null,
                resultData: null,
                status: 401
            };
        }

        devLogger.info(`[${FILE_NAME}] Calling user service to update profile photo`);
        const updateProfilePhotoResult = await userService.updateUserProfilePhoto(userID, body, token);

        devLogger.info(`[${FILE_NAME}] User profile photo update service completed`);

        if (!updateProfilePhotoResult?.success) {
            devLogger.error(`[${FILE_NAME}] Failed to update user profile photo: ${updateProfilePhotoResult?.errorMessage || "Profile photo update failed"}`);
            throw updateProfilePhotoResult;
        }

        devLogger.success(`[${FILE_NAME}] User profile photo updated successfully`);
        devLogger.info(`[${FILE_NAME}] Sending profile photo update response to client`);

        return res.status(200).json({
            success: true,
            error: false,
            successMessage: updateProfilePhotoResult.successMessage,
            errorMessage: "",
            errorData: null,
            resultData: updateProfilePhotoResult.resultData
        });
    }
    catch (error) {
        devLogger.error(`[${FILE_NAME}] Failed to update user profile photo`, error);
        devLogger.warn(`[${FILE_NAME}] User profile photo update request could not be completed`);
        return handleError(res, error);
    }
}
// ============================================================
// Update User Profile Photo Ends
// ============================================================



// ============================================================
// Update User Basic Information Starts
// ============================================================
async function updateUserBasicInformation(req, res, next) {
    devLogger.info(`[${FILE_NAME}] Update user basic information request received`);

    try {
        devLogger.info(`[${FILE_NAME}] Extracting user ID from request parameters`);
        const userID = req.params.userID;

        if (!userID) {
            devLogger.warn(`[${FILE_NAME}] Basic information update request received without user ID`);
            throw {
                success: false,
                error: true,
                successMessage: "",
                errorMessage: "User ID is required",
                errorData: null,
                resultData: null,
                status: 400
            };
        }

        devLogger.info(`[${FILE_NAME}] Extracting basic information request body`);
        const body = req.body;

        devLogger.info(`[${FILE_NAME}] Extracting authentication token from request headers`);
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        if (!token) {
            devLogger.warn(`[${FILE_NAME}] Logout request received without authentication token`);
            throw {
                success: false,
                error: true,
                successMessage: "",
                errorMessage: "Authentication token is required",
                errorData: null,
                resultData: null,
                status: 401
            };
        }

        devLogger.info(`[${FILE_NAME}] Calling user service to update basic information`);
        const userBasicInfoUpdateResult = await userService.updateUserBasicInformation(userID, body, token);

        devLogger.info(`[${FILE_NAME}] User basic information update service completed`);

        if (!userBasicInfoUpdateResult?.success) {
            devLogger.error(`[${FILE_NAME}] Failed to update user basic information: ${userBasicInfoUpdateResult?.errorMessage || "Basic information update failed"}`);
            throw userBasicInfoUpdateResult;
        }

        devLogger.success(`[${FILE_NAME}] User basic information updated successfully`);
        devLogger.info(`[${FILE_NAME}] Preparing basic information update response`);
        devLogger.info(`[${FILE_NAME}] Sending basic information update response to client`);

        return res.status(200).json({
            success: true,
            error: false,
            successMessage: userBasicInfoUpdateResult.successMessage,
            errorMessage: "",
            errorData: null,
            resultData: userBasicInfoUpdateResult.resultData
        });
    }
    catch (error) {
        devLogger.error(`[${FILE_NAME}] Failed to update user basic information`, error);
        devLogger.warn(`[${FILE_NAME}] User basic information update request could not be completed`);
        return handleError(res, error);
    }
}
// ============================================================
// Update User Basic Information Ends
// ============================================================



// ============================================================
// Update User Email Username Starts
// ============================================================
async function updateUserEmailUsername(req, res, next) {
    devLogger.info(`[${FILE_NAME}] Update user email and username request received`);

    try {
        devLogger.info(`[${FILE_NAME}] Extracting user ID from request parameters`);
        const userID = req.params.userID;

        if (!userID) {
            devLogger.warn(`[${FILE_NAME}] Email and username update request received without user ID`);
            throw {
                success: false,
                error: true,
                successMessage: "",
                errorMessage: "User ID is required",
                errorData: null,
                resultData: null,
                status: 400
            };
        }

        devLogger.info(`[${FILE_NAME}] Extracting email and username request body`);
        const body = req.body;

        devLogger.info(`[${FILE_NAME}] Extracting authentication token from request headers`);
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        if (!token) {
            devLogger.warn(`[${FILE_NAME}] Logout request received without authentication token`);
            throw {
                success: false,
                error: true,
                successMessage: "",
                errorMessage: "Authentication token is required",
                errorData: null,
                resultData: null,
                status: 401
            };
        }

        devLogger.info(`[${FILE_NAME}] Calling user service to update email and username`);
        const updateEmailUsernameResult = await userService.updateUserEmailUsername(userID, body, token);

        devLogger.info(`[${FILE_NAME}] User email and username update service completed`);

        if (!updateEmailUsernameResult?.success) {
            devLogger.error(`[${FILE_NAME}] Failed to update user email and username: ${updateEmailUsernameResult?.errorMessage || "Email and username update failed"}`);
            throw updateEmailUsernameResult;
        }

        devLogger.success(`[${FILE_NAME}] User email and username updated successfully`);
        devLogger.info(`[${FILE_NAME}] Preparing email and username update response`);
        devLogger.info(`[${FILE_NAME}] Sending email and username update response to client`);

        return res.status(200).json({
            success: true,
            error: false,
            successMessage: updateEmailUsernameResult.successMessage,
            errorMessage: "",
            errorData: null,
            resultData: updateEmailUsernameResult.resultData
        });
    }
    catch (error) {
        devLogger.error(`[${FILE_NAME}] Failed to update user email and username`, error);
        devLogger.warn(`[${FILE_NAME}] User email and username update request could not be completed`);
        return handleError(res, error);
    }
}
// ============================================================
// Update User Email Username Ends
// ============================================================



// ============================================================
// Update User Password Starts
// ============================================================
async function updateUserPassword(req, res, next) {
    devLogger.info(`[${FILE_NAME}] Update user password request received`);

    try {
        devLogger.info(`[${FILE_NAME}] Extracting user ID from request parameters`);
        const userID = req.params.userID;

        if (!userID) {
            devLogger.warn(`[${FILE_NAME}] Password update request received without user ID`);
            throw {
                success: false,
                error: true,
                successMessage: "",
                errorMessage: "User ID is required",
                errorData: null,
                resultData: null,
                status: 400
            };
        }

        devLogger.info(`[${FILE_NAME}] Extracting password update request body`);
        const body = req.body;

        devLogger.info(`[${FILE_NAME}] Extracting authentication token from request headers`);
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        if (!token) {
            devLogger.warn(`[${FILE_NAME}] Logout request received without authentication token`);
            throw {
                success: false,
                error: true,
                successMessage: "",
                errorMessage: "Authentication token is required",
                errorData: null,
                resultData: null,
                status: 401
            };
        }

        devLogger.info(`[${FILE_NAME}] Calling user service to update password`);
        const updateUserPasswordResult = await userService.updateUserPassword(userID, body, token);

        devLogger.info(`[${FILE_NAME}] User password update service completed`);

        if (!updateUserPasswordResult?.success) {
            devLogger.error(`[${FILE_NAME}] Failed to update user password: ${updateUserPasswordResult?.errorMessage || "Password update failed"}`);
            throw updateUserPasswordResult;
        }

        devLogger.success(`[${FILE_NAME}] User password updated successfully`);
        devLogger.info(`[${FILE_NAME}] Preparing password update response`);
        devLogger.info(`[${FILE_NAME}] Sending password update response to client`);

        return res.status(200).json({
            success: true,
            error: false,
            successMessage: updateUserPasswordResult.successMessage,
            errorMessage: "",
            errorData: null,
            resultData: updateUserPasswordResult.resultData
        });
    }
    catch (error) {
        devLogger.error(`[${FILE_NAME}] Failed to update user password`, error);
        devLogger.warn(`[${FILE_NAME}] User password update request could not be completed`);
        return handleError(res, error);
    }
}
// ============================================================
// Update User Password Ends
// ============================================================



// ============================================================
// Controller Exports Starts
// ============================================================
module.exports = {
    updateUserProfilePhoto,
    updateUserBasicInformation,
    updateUserEmailUsername,
    updateUserPassword
};
// ============================================================
// Controller Exports Ends
// ============================================================
