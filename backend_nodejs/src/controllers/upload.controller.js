'use strict'

const { SuccessResponse } = require("../core/success.response")

const { uploadImageFromUrl } = require('../services/upload.service')

class UploadController {
    uploadFile = async( req , res , next) => {
        new SuccessResponse({
            message: 'Upload file successfully',
            metadata: await uploadImageFromUrl()
        }).send(res)
    }
}


module.exports = new UploadController()