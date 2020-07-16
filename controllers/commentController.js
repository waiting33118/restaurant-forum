const commentService = require('../services/commentService')

const commentController = {
  postComment: (req, res) => {
    commentService.postComment(req, res, result => res.redirect(`/restaurants/${result.restaurantId}`))
  },
  deleteComment: (req, res) => {
    commentService.deleteComment(req, res, result => res.redirect(`/restaurants/${result.RestaurantId}`))
  }
}
module.exports = commentController
