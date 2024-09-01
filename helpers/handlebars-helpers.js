const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')

dayjs.extend(relativeTime)

const handlebarsHelpers = {
  currentYear: () => dayjs().year(),
  fromNow: date => dayjs(date).fromNow(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  count: datas => datas.length
}

module.exports = handlebarsHelpers
