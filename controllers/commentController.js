const commentService = require('../services/commentService')

const commentController = {
  postComment: (req, res) => {
    commentService.postComment(req, res, result => res.redirect(`/restaurants/${result.restaurantId}`))
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
