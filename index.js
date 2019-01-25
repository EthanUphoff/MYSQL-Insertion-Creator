const readline = require('readline')
var fs = require('fs')
var inputs = []
var columns = []
var num = 0
var tablename = ''
var finalinput = ''

fs.writeFile('output.txt', '', function (err) {
  if (err) throw err
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Please paste file location: ', (answer) => {
  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(answer)
  })

  lineReader.on('line', function (line) {
    var regex = /(\S+)-(\s)(.*)/i
    if (line.includes('Table name: ')) {
      tablename = line.replace(/Table name:(\s)/g, '')
    } else if (line !== '') {
      let matches = line.match(regex)
      columns[num] = matches[1]
      inputs[num] = matches[3]
      num++
    } else if (line === '') {
      let finalcolumns = '(' + columns.toString().replace(/,/g, ', ') + ')'
      inputs.forEach(function (item, index, array) {
        if (item.match(/(\d+)/g) != null || item.match(/(\d+)\.(\d*)/g) != null || item.match(/(\d*)\.(\d+)/g) != null) {
          finalinput = finalinput + item + ', '
        } else {
          finalinput = finalinput + "'" + item + "', "
        }
      })
      finalinput = '(' + finalinput.slice(0, -2) + ')'
      let finaloutput = 'INSERT INTO ' + tablename + ' ' + finalcolumns + ' VALUES ' + finalinput + '\n'
      fs.appendFile('output.txt', finaloutput, function (err) {
        if (err) throw err
        // console.log('succ')
      })
      finaloutput = ''
      finalinput = ''
      inputs = []
      columns = []
      num = 0
    }
  })
  rl.close()
})
