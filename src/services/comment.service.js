"use strict";

const Comment = require("../models/comment.model");
const { convertToObjIdMongodb } = require("../utils");

/**
 * key features : Comment service
 * add comment [User , Shop]
 * get a list of comments [User , Shop]
 * delete a comment [User | Shop | Admin]
 */
class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    })

    let rightValue 
    if(parentCommentId) {
        // reply comment
    }else {
        const maxRightValue = await Comment.findOne({
            comment_productId : convertToObjIdMongodb(productId)

        },'comment_right' , {sort : {comment_right: -1}})
        if(maxRightValue) {
            rightValue = maxRightValue.right + 1
        }else {
            rightValue = 1
        }
    }

    // insert to comment

    comment.comment_left = rightValue
    comment.comment_right = rightValue + 1


    await comment.save()

    return comment
  }

}

module.exports = CommentService
