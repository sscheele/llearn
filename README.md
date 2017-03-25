# Express-Scaffold
This is a node.js app that can be used as a framework for a website with local authentication. It includes virtually no styling, so you can modify it as needed. Sessions are stored in your local MongoDB database.

## Installation
First, download this repository:
```
$ git clone git@github.com:sscheele/express-scaffold
```
Next, you only have to change a handful of things to get yourself started.

**In server.js:** Replace `var dbPath = 'mongodb://localhost:27017/passport';` with the URI of your MongoDB database

**In server.js:** Replace `secret: 'ilovescotchscotchyscotchscotch'` with a secret of your own making

## Credits
Much of the code in this app comes from a Scotch tutorial, liscensed under the MIT license. I've added the feature of storing sessions in the database instead of in RAM, changed the view models to Pug instead of EJS, removed a handful of extraneous styling, and cut out third-party authentication. If there's something you'd care to see in here, please add an issue or a pull request!