const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: (req, res) => {
    const { text, restaurantId } = req.body
    const { id } = req.user
    Comment.create({
      text,
      RestaurantId: restaurantId,
      UserId: id
    }).then(() => res.redirect(`/restaurants/${restaurantId}`))
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
