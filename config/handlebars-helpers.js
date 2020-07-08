const moment = require('moment')

module.exports = {
  ifCond: (a, b, options) => {
    if (a === b) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  },
  moment: (a) => moment(a).fromNow()
}
