const express = require('express');
const app = express();
const http = require('http').Server(app);

const router = require('./router/index'); 
const morgan = require('morgan');
const path = require('path');

const port = 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname + "/public")));

app.use("/", router);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});
