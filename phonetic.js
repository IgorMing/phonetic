var express = require('express');
var app = express();

const port = 8080;

app.listen(port, function () {

  // the node process has two default arguments
  // this validation checks if some additional argument exists
  if (process.argv.length < 3) {
    process.kill(process.pid, 'No arguments');
  }

  phonetic();

});

function phonetic() {

  // set utf-8 encoding
  process.stdin.setEncoding('utf8');

  // handler on read the text file (word_dict.txt)
  process.stdin.on('readable', () => {
    const chunk = process.stdin.read();

    if (chunk !== null) {

      // get all words by line breaks
      const fileWords = chunk.split('\n');

      process.argv.forEach((argValue, argIndex) => {

        // ignore the first and second loop (default process arguments)
        if (argIndex < 2) {
          return;
        }

        // print the argument
        process.stdout.write(`${argValue}: `);

        fileWords.forEach((word, fileIndex) => {

          // ignore the last line break, always contains an empty string
          if (fileIndex === fileWords.length-1) {
            return;
          }

          // if true, print the word
          if (isPhoneticallyEqual(argValue, word)){
            process.stdout.write(`${word}, `);
          }

        });

        // finishing all file words, add a line break
        process.stdout.write('\n');
      });
    }
  });
}

function isPhoneticallyEqual(argWord, fileWord) {
  var newArgWord = phoneticRule(argWord);
  var newFileWord = phoneticRule(fileWord);

  // after the phoneticRule, both words must contain the same length
  if (newArgWord.length !== newFileWord.length) {
    return false;
  }

  var length = newArgWord.length;
  var equivalentWords = true;
  var i;
  for (i = 0; i < length; i++) {
    // for each character, check the equivalence
    if (!isEquivalent(newArgWord[i], newFileWord[i])) {
      equivalentWords = false;
      break;
    }
  }

  return equivalentWords;
}

function isEquivalent(argChar, fileChar) {

  // if is the same character, is equivalent
  if (argChar === fileChar) {
    return true;
  }

  var equivalents = [
    ['a', 'e', 'i', 'o', 'u'],
    ['c', 'g', 'j', 'k', 'q', 's', 'x', 'y', 'z'],
    ['b', 'f', 'p', 'v', 'w'],
    ['d', 't'],
    ['m', 'n']
  ];

  var exists = false;
  equivalents.forEach((v, i) => {

    // for each equivalence array, is checked for both characters
    if (contains.call(v, argChar) && contains.call(v, fileChar)) {
      exists = true;
    }

  });

  return exists;
}

function phoneticRule(word) {

  // remove non alphabetic characters
  var ruleWord = onlyAlphabetic(word);

  // preserve the uppercase from original word
  ruleWord = ruleWord.toLowerCase();

  // validate strings with only one character
  if (ruleWord.length < 2) {
    return ruleWord;
  }

  // remove ignored characters starting of second position of string
  ruleWord = removeIgnoredChars(ruleWord.substring(2, ruleWord.length));

  // string without duplicated characters
  return getUniqueChars(ruleWord);
}

function onlyAlphabetic(word) {
  // regex to return only alphabetic characters
  return word.match(/[a-zA-Z]+/g).join('');
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

  /**
   * with ES6, is possible to use the following method:
   * [myarray].includes(element);
   * but I prefered to implement my own method, with ES5
   */

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
