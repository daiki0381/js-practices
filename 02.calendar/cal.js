'use strict';

/*
[-] 最初の日付の曜日数を取得
[-] 最後の日を取得
[-] 月と年を表示
[-] 曜日を表示
[-] 余分な曜日数を字下げ
[-] 最初の日から最後の日まで順番に表示
[] クラス化
*/

const thisYear = new Date().getFullYear();
const thisMonth = new Date().getMonth();
let firstDayOfTheMonth = new Date(thisYear, thisMonth, 1).getDay();
const lastDayOfTheMonth = new Date(thisYear, thisMonth + 1, 0).getDate();
const top = `      ${thisMonth + 1}月 ${thisYear}`;
console.log(top)
console.log('日 月 火 水 木 金 土');
process.stdout.write('   '.repeat(firstDayOfTheMonth));
for (let i = 1; i <= lastDayOfTheMonth; i++) {
  if (firstDayOfTheMonth % 7 === 0 && firstDayOfTheMonth !== 0) {
    if (i >= 10) {
      process.stdout.write(`\n${i} `);
    } else {
      process.stdout.write(`\n ${i} `);
    }
  } else {
    if (i >= 10) {
      process.stdout.write(`${i} `);
    } else {
      process.stdout.write(` ${i} `);
    }
  }
  firstDayOfTheMonth += 1;
}
