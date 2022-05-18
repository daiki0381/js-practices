const uuid4 = require('uuid4')
const fs = require('fs')
const { Select } = require('enquirer')

// 追加
function add () {
  const standardInput = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\n')
  const id = uuid4()
  fs.writeFileSync(`./data/${id}.json`, JSON.stringify(standardInput))
}

// 一覧
function list () {
  const files = fs.readdirSync('./data')
  files.forEach(file => {
    const jsonFormatMemo = fs.readFileSync(`./data/${file}`)
    console.log(JSON.parse(jsonFormatMemo)[0])
  })
}

// 参照
function show () {
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
  })
  prompt.run().then(answer => {
    files.forEach(file => {
      const jsonFormatMemo = fs.readFileSync(`./data/${file}`)
      if (JSON.parse(jsonFormatMemo)[0] === answer) {
        JSON.parse(jsonFormatMemo).forEach(memo => console.log(memo))
      }
    })
  }).catch(err => console.error(err))
}

// 削除
function remove () {
  const files = fs.readdirSync('./data')
  const firstMemos = files.map(file => {
    const jsonFormatMemo = fs.readFileSync(`./data/${file}`)
    return JSON.parse(jsonFormatMemo)[0]
  })
  const prompt = new Select({
    name: 'memos',
    message: 'Choose a note you want to delete:',
    choices: firstMemos
  })
  prompt.run().then(answer => {
    files.forEach(file => {
      const jsonFormatMemo = fs.readFileSync(`./data/${file}`)
      if (JSON.parse(jsonFormatMemo)[0] === answer) {
        fs.unlinkSync(`./data/${file}`)
      }
    })
  }).catch(err => console.error(err))
}

const option = process.argv[2]
if (option === '-l') {
  list()
} else if (option === '-r') {
  show()
} else if (option === '-d') {
  remove()
} else {
  add()
}
