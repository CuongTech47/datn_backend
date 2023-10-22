'use strict'


const express = require('express')

const commentController = require('../../controllers/comment.controller')

const router = express.Router()

const asyncHandler = require("../../helpers/asyncHandler")

const { authenticationV2 } = require('../../auth/authUtils')

router.use(authenticationV2)


router.post('',asyncHandler(commentController.createComment))
router.delete('',asyncHandler(commentController.deleteComment))
router.get('',asyncHandler(commentController.getCommentsByParentId))


module.exports = router