const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: (req, res, callback) => {
    const { text, restaurantId } = req.body
    Comment.create({
      text,
      RestaurantId: restaurantId,
      UserId: req.user.id
    }).then(() => callback({ restaurantId, status: 'success', message: '成功建立留言！' }))
  },
  deleteComment: (req, res, callback) => {
    Comment.findByPk(req.params.id)
      .then((comment) => comment.destroy())
      .then((comment) => callback({ RestaurantId: comment.RestaurantId, status: 'success', message: '成功刪除留言！' }))
      .catch((error) => console.log(error))
  }
}

module.exports = commentController
