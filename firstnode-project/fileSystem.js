const fs = require('node:fs');
// Blocking Method for interaction with file (Synchronous)
const text = fs.readFileSync('./textFile/norms.txt', 'utf-8');

const newTxt = `This: ${text}, was gotten from a file in same loaction`

fs.writeFileSync('./textFile/newText.txt', newTxt)
console.log('FIle Successfully created')

// Non Blocking Method of interacting with the file system (Asynchronous)
// This method uses function like {fs.readFile(), fs.writeFile()} to read and write
// respectively, just that the use callback function (err, data) => {}, which then 
// continue with the execution of other process.

// Callback hell is real