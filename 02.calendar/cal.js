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

  output () {
    console.log(`      ${this.month}月 ${this.year}`)
    console.log('日 月 火 水 木 金 土')
    let firstDayOfTheWeek = this._firstDayOfTheWeek()
    process.stdout.write('   '.repeat(firstDayOfTheWeek))
    for (let i = 1; i <= this._lastDayOfTheMonth(); i++) {
      if (firstDayOfTheWeek % 7 === 0 && firstDayOfTheWeek !== 0) {
        i >= 10 ? process.stdout.write(`\n${i} `) : process.stdout.write(`\n ${i} `)
      } else {
        i >= 10 ? process.stdout.write(`${i} `) : process.stdout.write(` ${i} `)
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
