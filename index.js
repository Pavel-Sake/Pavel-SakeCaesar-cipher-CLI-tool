const commander = require('commander');
const fs = require('fs');
const path = require('path');
const {Transform} = require('stream');
const {Writable} = require('stream');

const dataArr = require('./data');

commander
  .option('-a, --action <type>', 'an action encode/decode')
  .option('-s, --shift <type>', 'a shift',)
  .option('-i, --input <type>', 'an input file')
  .option('-o, --output <type>', 'an output file');

commander.parse(process.argv);

class Cli extends Transform {
  constructor(...opt) {
    super(opt);
    this.opt = opt;
  }

  _transform(chunk, encoding, callback) {
    let [action, shift, input, dataInput, output] = this.opt;
    let newDataArr = dataArr;

    if (action === 'decode') {
      newDataArr.reverse();
    }
    console.log(this.opt);

    shift = Number(shift);
    let data = chunk;

    if (!input) {
      data = dataInput;
    }

    const questionInArr = data.toString().split('');
    let answerInArr = [];

    questionInArr.forEach((element) => {

      if (newDataArr.includes(element) === false) {
        answerInArr.push(element);
      }

      for (let i = 0; i < newDataArr.length; i++) {
        let shiftNumberSymbol = i + shift;

        if (element === newDataArr[i]) {

          if (i + shift > newDataArr.length) {

            shiftNumberSymbol = shiftNumberSymbol - (newDataArr.length + 1);
            answerInArr.push(newDataArr[shiftNumberSymbol]);
          } else {
            answerInArr.push(newDataArr[shiftNumberSymbol]);
          }
        }
      }
    });

    const answer = answerInArr.join('');

    console.log('output', output);
    if (!output) {
      process.stdout.write(`Ответ > ${answer}`);
    }

    this.push(answer);
    callback()
  }
}


const action = commander.action;
const shift = commander.shift;
const input = commander.input;
const output = commander.output;


const read = fs.createReadStream(path.join(__dirname, 'input.txt'));
const write = fs.createWriteStream(path.join(__dirname, 'output.txt'));


if (input === undefined) {
  process.stdout.write('Ввидите слово для его закадирования > ');
  process.stdin.on('data', (data) => {
    process.stdout.write('Ввидите слово для его закадирования > ');

    readCli(action, shift, input, data, output)
  })
}
else {
  read
    .pipe(new Cli(action, shift, input, data= false, output))
    .pipe(write);
}

function readCli(action, shift, input, dataInput, output) {

  const read = fs.createReadStream(path.join(__dirname, 'input.txt'));
  const write = fs.createWriteStream(path.join(__dirname, 'output.txt'));

  read
    .pipe(new Cli(action, shift, input, dataInput, output))
    .pipe(write);

}

