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
  deleteComment: (req, res) => {
    const { id } = req.params
    Comment.findByPk(id)
      .then((comment) => comment.destroy())
      .then((comment) => res.redirect(`/restaurants/${comment.RestaurantId}`))
      .catch((error) => console.log(error))
  }
}

module.exports = commentController
