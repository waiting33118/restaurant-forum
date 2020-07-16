const commentService = require('../../services/commentService')

const commentController = {
  postComment: (req, res) => {
    commentService.postComment(req, res, result => res.json({ result }))
  }
}

module.exports = commentController
