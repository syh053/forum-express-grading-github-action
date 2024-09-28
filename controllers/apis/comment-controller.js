const commentServices = require('../../services/comment-services') // 載入 commentServices

const commentController = {
  postComment: (req, res, next) => {
    commentServices.postComment(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  }
}

module.exports = commentController
