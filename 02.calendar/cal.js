'use strict'

class Calendar {
  constructor (year, month) {
    this.year = year
    this.month = month
  }

  _firstDayOfTheWeek () {
    return new Date(this.year, this.month - 1, 1).getDay()
  }

  _lastDayOfTheMonth () {
    return new Date(this.year, this.month, 0).getDate()
  }

  _JudgmentOfSaturday (dayOfWeek) {
    return new Date(this.year, this.month - 1, dayOfWeek).getDay() === 6
  }

  output () {
    console.log(`      ${this.month}月 ${this.year}`)
    console.log('日 月 火 水 木 金 土')
    let firstDayOfTheWeek = this._firstDayOfTheWeek()
    process.stdout.write('   '.repeat(firstDayOfTheWeek))
    for (let i = 1; i <= this._lastDayOfTheMonth(); i++) {
      if (this._JudgmentOfSaturday(i)) {
        process.stdout.write(`${i} `.padStart(3, ' '))
        process.stdout.write('\n')
      } else {
        process.stdout.write(`${i} `.padStart(3, ' '))
      }
      firstDayOfTheWeek += 1
    }
  }
}

const params = require('minimist')(process.argv.slice(2))
const year = params.y || new Date().getFullYear()
const month = params.m || new Date().getMonth() + 1
const calendar = new Calendar(year, month)
calendar.output()
