const dayjs = require('dayjs')

const handlebarsHelpers = {
  currentYear: () => dayjs().year()
}

module.exports = handlebarsHelpers
