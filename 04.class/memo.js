const uuid4 = require('uuid4')
const fs = require('fs')
const { Select } = require('enquirer')
const SAVEDIR = './data'

class Memo {
  static #add () {
    const standardInput = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n')
    const id = uuid4()
    fs.writeFileSync(`${SAVEDIR}/${id}.json`, JSON.stringify(standardInput))
  }

  static #list () {
    const files = fs.readdirSync(SAVEDIR)
    files.forEach(file => {
      const jsonFormatMemo = fs.readFileSync(`${SAVEDIR}/${file}`)
      console.log(JSON.parse(jsonFormatMemo)[0])
    })
  }

  static async #show () {
    const files = fs.readdirSync(SAVEDIR)
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
    })
    const answer = await prompt.run().catch(err => console.error(err))
    files.forEach(file => {
      const jsonFormatMemo = fs.readFileSync(`${SAVEDIR}/${file}`)
      if (JSON.parse(jsonFormatMemo)[0] === answer) {
        JSON.parse(jsonFormatMemo).forEach(memo => console.log(memo))
      }
    })
  }

  static async #remove () {
    const files = fs.readdirSync(`${SAVEDIR}`)
    const firstMemos = files.map(file => {
      const jsonFormatMemo = fs.readFileSync(`${SAVEDIR}/${file}`)
      return JSON.parse(jsonFormatMemo)[0]
    })
    const prompt = new Select({
      name: 'memos',
      message: 'Choose a note you want to delete:',
      choices: firstMemos
    })
    const answer = await prompt.run().catch(err => console.error(err))
    files.forEach(file => {
      const jsonFormatMemo = fs.readFileSync(`${SAVEDIR}/${file}`)
      if (JSON.parse(jsonFormatMemo)[0] === answer) {
        fs.unlinkSync(`${SAVEDIR}/${file}`)
      }
    })
  }

  static outputAdd () {
    if (!fs.existsSync(SAVEDIR)) {
      fs.mkdirSync(SAVEDIR)
    } else {
      Memo.#add()
    }
  }

  static outputList () {
    if (!fs.existsSync(SAVEDIR)) {
      fs.mkdirSync(SAVEDIR)
    } else if (!fs.readdirSync(SAVEDIR).length) {
      ;
    } else {
      Memo.#list()
    }
  }

  static outputShow () {
    if (!fs.existsSync(SAVEDIR)) {
      fs.mkdirSync(SAVEDIR)
    } else if (!fs.readdirSync(SAVEDIR).length) {
      ;
    } else {
      Memo.#show()
    }
  }

  static outputRemove () {
    if (!fs.existsSync(SAVEDIR)) {
      fs.mkdirSync(SAVEDIR)
    } else if (!fs.readdirSync(SAVEDIR).length) {
      ;
    } else {
      Memo.#remove()
    }
  }
}

module.exports = Memo
