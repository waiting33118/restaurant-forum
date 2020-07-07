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
  }
}

module.exports = commentController
