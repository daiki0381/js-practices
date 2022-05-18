const uuid4 = require('uuid4')
const fs = require('fs')
const { Select } = require('enquirer')

// dataディレクトリがない場合の処理
function dataDirectoryExists () {
  if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data')
  }
}

// dataディレクトリ内にファイルがない場合の処理
function dataFileExists () {
  if (fs.readdirSync('./data').length === 0) {
    add()
  }
}

// 追加
function add () {
  dataDirectoryExists()
  const standardInput = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\n')
  const id = uuid4()
  fs.writeFileSync(`./data/${id}.json`, JSON.stringify(standardInput))
}

// 一覧
function list () {
  dataDirectoryExists()
  dataFileExists()
  const files = fs.readdirSync('./data')
  files.forEach((file) => {
    const jsonFormatMemo = fs.readFileSync(`./data/${file}`)
    console.log(JSON.parse(jsonFormatMemo)[0])
  })
}

// 参照
function show () {
  dataDirectoryExists()
  dataFileExists()
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
  dataDirectoryExists()
  dataFileExists()
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
