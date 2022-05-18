const Memo = require('./memo')

const option = process.argv[2]

if (option === '-l') {
  Memo.outputList()
} else if (option === '-r') {
  Memo.outputShow()
} else if (option === '-d') {
  Memo.outputRemove()
} else {
  Memo.outputAdd()
}
