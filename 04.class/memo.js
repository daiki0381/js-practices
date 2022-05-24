const uuid4 = require('uuid4')
const fs = require('fs')
const { Select } = require('enquirer')
const SAVEDIR = './data'

class Memo {
  static _add () {
    const standardInput = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n')
    const id = uuid4()
    fs.writeFileSync(`${SAVEDIR}/${id}.json`, JSON.stringify(standardInput))
  }

  static _list () {
    const files = fs.readdirSync(`${SAVEDIR}`)
    files.forEach(file => {
      const jsonFormatMemo = fs.readFileSync(`${SAVEDIR}/${file}`)
      console.log(JSON.parse(jsonFormatMemo)[0])
    })
  }

  static _show () {
    const files = fs.readdirSync(`${SAVEDIR}`)
    const firstMemos = files.map(file => {
      const jsonFormatMemo = fs.readFileSync(`${SAVEDIR}/${file}`)
      return JSON.parse(jsonFormatMemo)[0]
    })
    const prompt = new Select({
      name: 'memos',
      message: 'Choose a note you want to see:',
      choices: firstMemos,
      footer () {
        const memos = []
        files.forEach(file => {
          const jsonFormatMemo = fs.readFileSync(`${SAVEDIR}/${file}`)
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
        const jsonFormatMemo = fs.readFileSync(`${SAVEDIR}/${file}`)
        if (JSON.parse(jsonFormatMemo)[0] === answer) {
          JSON.parse(jsonFormatMemo).forEach((memo) => console.log(memo))
        }
      })
    })()
  }

  static _remove () {
    const files = fs.readdirSync(`${SAVEDIR}`)
    const firstMemos = files.map(file => {
      const jsonFormatMemo = fs.readFileSync(`${SAVEDIR}/${file}`)
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
        const jsonFormatMemo = fs.readFileSync(`${SAVEDIR}/${file}`)
        if (JSON.parse(jsonFormatMemo)[0] === answer) {
          fs.unlinkSync(`${SAVEDIR}/${file}`)
        }
      })
    })()
  }

  static outputAdd () {
    if (!fs.existsSync(`${SAVEDIR}`)) {
      fs.mkdirSync(`${SAVEDIR}`)
    } else {
      Memo._add()
    }
  }

  static outputList () {
    if (!fs.existsSync(`${SAVEDIR}`)) {
      fs.mkdirSync(`${SAVEDIR}`)
    } else if (!fs.readdirSync(`${SAVEDIR}`).length) {
      ;
    } else {
      Memo._list()
    }
  }

  static outputShow () {
    if (!fs.existsSync(`${SAVEDIR}`)) {
      fs.mkdirSync(`${SAVEDIR}`)
    } else if (!fs.readdirSync(`${SAVEDIR}`).length) {
      ;
    } else {
      Memo._show()
    }
  }

  static outputRemove () {
    if (!fs.existsSync(`${SAVEDIR}`)) {
      fs.mkdirSync(`${SAVEDIR}`)
    } else if (!fs.readdirSync(`${SAVEDIR}`).length) {
      ;
    } else {
      Memo._remove()
    }
  }
}

module.exports = Memo
