const dayjs = require('dayjs')

const handlebarsHelpers = {
  currentYear: () => dayjs().year(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}

module.exports = handlebarsHelpers
