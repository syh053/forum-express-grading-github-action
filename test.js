const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')

dayjs.extend(relativeTime)

require('dayjs/locale/zh-tw')

dayjs.locale('zh-tw')

const relativeDate = dayjs('1999-01-01').fromNow()

console.log(relativeDate)
