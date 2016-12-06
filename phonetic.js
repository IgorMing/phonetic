var express = require('express');
var app = express();

const port = 8080;

app.get('/', function (req, res) {
  // process.argv.forEach((val, index) => {
  //   console.log(`${index}: ${val}`);
  // });


  res.send(process.argv[2]);
});

app.listen(port, function () {
  if (process.argv.length < 3) {
    process.kill(process.pid, 'No arguments');
  }

  getFileWords();

});

function getFileWords() {
  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      const fileWords = chunk.split('\n');

      // process.stdout.write(chunk);

      // console.log('hahahaaa', contains.call(fileWords, 'angel'))
      process.argv.forEach((argValue, argIndex) => {
        if (argIndex < 2) {
          return;
        }

        fileWords.forEach((word, fileIndex) => {
          if (fileIndex === fileWords.length-1) {
            return;
          }

          process.stdout.write(`File: ${phoneticRule(word)}\n`);
        });

        process.stdout.write('arg: ' + phoneticRule(argValue));
      });
    }
  });
}

function phoneticRule(word) {

  // preserve the original word
  var ruleWord = word.toLowerCase();

  // set the first character of the original word
  var finalWord = word[0];

  // validate strings with only one character
  if (ruleWord.length < 2) {
    return finalWord;
  }

  // remove ignored characters starting of second position of string
  finalWord += removeIgnoredChars(ruleWord.substring(2, ruleWord.length));

  // string without duplicated characters
  return getUniqueChars(finalWord);
}

function removeIgnoredChars(word) {
  var ignoredChars = ['a', 'e', 'i', 'h', 'o', 'u', 'w', 'y'];

  ignoredChars.forEach((character) => {
    var regex = new RegExp(character, 'g');
    word = word.replace(regex, '');
  });

  return word;
}

function getUniqueChars(word) {
  // remove repeated charaters
  return word.replace(/(.)(?=.*\1)/g, '');
}

function contains(element) {
    var indexOf = function(element) {
        var i = -1, index = -1;

        for(i = 0; i < this.length; i++) {
            var item = this[i];

            if((item !== item) || item === element) {
                index = i;
                break;
            }
        }

        return index;
    }

    return indexOf.call(this, element) > -1;
};
