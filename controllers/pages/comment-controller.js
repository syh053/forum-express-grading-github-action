const { Comment, Restaurant } = require('../../db/models') // 載入 Comment、Restaurant 物件

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
    const { id } = req.params

    return Comment.findByPk(id, { include: Restaurant })
      .then(comment => {
        if (!comment) throw new Error("Comment didn't exist!")

        return comment.destroy()
      })
      .then(deletedComment => {
        req.flash('error_messages', '成功刪除留言!')
        res.redirect(`/restaurants/${deletedComment.restaurantId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = commentController
