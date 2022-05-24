const uuid4 = require('uuid4')
const fs = require('fs')
const { Select } = require('enquirer')

class Memo {
  static _add () {
    const standardInput = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n')
    const id = uuid4()
    fs.writeFileSync(`./data/${id}.json`, JSON.stringify(standardInput))
  }

  static _list () {
    const files = fs.readdirSync('./data')
    files.forEach(file => {
      const jsonFormatMemo = fs.readFileSync(`./data/${file}`)
      console.log(JSON.parse(jsonFormatMemo)[0])
    })
  }

  static _show () {
    const files = fs.readdirSync('./data')
    const firstMemos = files.map(file => {
      const jsonFormatMemo = fs.readFileSync(`./data/${file}`)
      return JSON.parse(jsonFormatMemo)[0]
    })
    const prompt = new Select({
      name: 'memos',
      message: 'Choose a note you want to see:',
      choices: firstMemos,
      footer () {
        const memos = []
        files.forEach(file => {
          const jsonFormatMemo = fs.readFileSync(`./data/${file}`)
          if (JSON.parse(jsonFormatMemo)[0] === firstMemos[this.index].name) {
            JSON.parse(jsonFormatMemo).forEach(memo => memos.push(memo))
          }
        })
        return '\n' + memos.join('\n')
      }
    });
    (async () => {
      const answer = await prompt.run().catch(err => console.error(err))
      files.forEach((file) => {
        const jsonFormatMemo = fs.readFileSync(`./data/${file}`)
        if (JSON.parse(jsonFormatMemo)[0] === answer) {
          JSON.parse(jsonFormatMemo).forEach((memo) => console.log(memo))
        }
      })
    })()
  }

  static _remove () {
    const files = fs.readdirSync('./data')
    const firstMemos = files.map(file => {
      const jsonFormatMemo = fs.readFileSync(`./data/${file}`)
      return JSON.parse(jsonFormatMemo)[0]
    })
    const prompt = new Select({
      name: 'memos',
      message: 'Choose a note you want to delete:',
      choices: firstMemos
    });
    (async () => {
      const answer = await prompt.run().catch(err => console.error(err))
      files.forEach(file => {
        const jsonFormatMemo = fs.readFileSync(`./data/${file}`)
        if (JSON.parse(jsonFormatMemo)[0] === answer) {
          fs.unlinkSync(`./data/${file}`)
        }
      })
    })()
  }

  static outputAdd () {
    if (!fs.existsSync('./data')) {
      fs.mkdirSync('./data')
    } else {
      Memo._add()
    }
  }

  static outputList () {
    if (!fs.existsSync('./data')) {
      fs.mkdirSync('./data')
    } else if (!fs.readdirSync('./data').length) {
      Memo._add()
    } else {
      Memo._list()
    }
  }

  static outputShow () {
    if (!fs.existsSync('./data')) {
      fs.mkdirSync('./data')
    } else if (!fs.readdirSync('./data').length) {
      Memo._add()
    } else {
      Memo._show()
    }
  }

  static outputRemove () {
    if (!fs.existsSync('./data')) {
      fs.mkdirSync('./data')
    } else if (!fs.readdirSync('./data').length) {
      Memo._add()
    } else {
      Memo._remove()
    }
  }
}

module.exports = Memo
