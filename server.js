//
// This file must be in ES5 and is the start up file for our bot.
//
// http://stackoverflow.com/a/33644849/193165
//

"use strict";

var dotenv = require('dotenv');
var env = dotenv.config({silent: true});

if (!process.env.BOT_API_KEY) {
    console.log("Error: Specify slack api token in the environment variable 'token' first please.");
    process.exit(1);
}

console.log("Compiling ES6 code before startup ...");

require("babel-polyfill");
require("babel-core/register")({
  extensions: [".es6", ".es", ".jsx", ".js"]
});
require("./src/index.es6");

console.log("Done - Your bot is running now. Press CTRL-C to stop it.");
