const commentServices = require('../../services/comment-services') // 載入 commentServices

const commentController = {
  postComment: (req, res, next) => {
    const { restaurantId } = req.body // 取得 restaurantId
    commentServices.postComment(req, (err, result) => {
      if (err) return next(err)

      req.flash('success_messages', '成功留言!')
      res.redirect(`/restaurants/${restaurantId}`)
    })
  },

  deleteComment: (req, res, next) => {
    commentServices.deleteComment(req, (err, result) => {
      if (err) return next(err)

      req.flash('error_messages', '成功刪除留言!')
      res.redirect(`/restaurants/${result.Restaurant.id}`)
    })
  }

}

module.exports = commentController
