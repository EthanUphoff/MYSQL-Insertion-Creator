const readline = require('readline')
var databasename = ''
var fs = require('fs')
var inputs = []
var columns = []
var num = 0
var tablename = ''
var finalinput = ''
var outputfilesetup = true

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
    if (line.includes('Database name: ')) {
      databasename = line.replace(/Database name:(\s)/g, '')
    } else if (line.includes('Table name: ')) {
      tablename = line.replace(/Table name:(\s)/g, '')
    } else if (line !== '') {
      let matches = line.match(regex)
      columns[num] = matches[1]
      inputs[num] = matches[3]
      num++
    } else if (line === '') {
      if (outputfilesetup) {
        var tablecreation = ''
        columns.forEach(function (item, index, array) {
          tablecreation = tablecreation + item + ' ' + inputs[index] + ', '
        })
        tablecreation = '(' + tablecreation.slice(0, -2) + ')'
        var outputsetup = 'use ' + databasename + ';\n'
        outputsetup = outputsetup + 'CREATE TABLE ' + tablename + tablecreation + ';\n'
        fs.appendFile('output.txt', outputsetup, function (err) {
          if (err) throw err
        })
        outputfilesetup = false
      } else {
        let finalcolumns = '(' + columns.toString().replace(/,/g, ', ') + ')'
        inputs.forEach(function (item, index, array) {
          var digit = item.match(/(\d+)/)
          var float1 = item.match(/(\d+)\.(\d*)/)
          var float2 = item.match(/(\d*)\.(\d+)/)
          digit = digit != null && digit[0] === item
          float1 = float1 != null && float1[0] === item
          float2 = float2 != null && float2[0] === item
          if (digit || float1 || float2) {
            console.log(item.match(/(\d+)/))
            console.log(item)
            finalinput = finalinput + item + ', '
          } else {
            finalinput = finalinput + "'" + item + "', "
          }
        })
        finalinput = '(' + finalinput.slice(0, -2) + ')'
        let finaloutput = 'INSERT INTO ' + tablename + ' ' + finalcolumns + ' VALUES ' + finalinput + ';\n'

        fs.appendFile('output.txt', finaloutput, function (err) {
          if (err) throw err
        })
        finaloutput = ''
      }
      finalinput = ''
      inputs = []
      columns = []
      num = 0
    }
  })
  rl.close()
})
