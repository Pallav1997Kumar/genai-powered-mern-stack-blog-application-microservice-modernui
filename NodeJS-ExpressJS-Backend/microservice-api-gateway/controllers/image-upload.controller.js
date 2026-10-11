function uploadBlogImageController (req, res) {
    res.status(200).json({
        success: true,
        error: false,
        successMessage: "Blog image uploaded successfully!",
        errorMessage: "",
        errorData: null,
        file: req.file
    });
}


function uploadProfilePhotoController (req, res) {
    res.status(200).json({
        success: true,
        error: false,
        successMessage: "Profile photo uploaded successfully!",
        errorMessage: "",
        errorData: null,
        file: req.file
    });
}


module.exports = {
    uploadBlogImageController,
    uploadProfilePhotoController
};