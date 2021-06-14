const express = require('express');
const routerUser = require('./routes/users');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routerCards = require('./routes/cards');

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.urlencoded({ extended: true ,type: '*/x-www-form-urlencoded'}));

app.use((req, res, next) => {
  req.user = {
    _id: '60c72ecd5b5b2cd9ff22a9e3' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/', routerUser);
app.use('/', routerCards);


app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`)
})