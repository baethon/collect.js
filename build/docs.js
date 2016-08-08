const jsdox = require('jsdox');

jsdox.generateForDir(`${__dirname}/../lib/index.js`, __dirname, `${__dirname}/templates`, (...args) => {
  console.log(args);
});
