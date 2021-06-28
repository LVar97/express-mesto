const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-err');

// const ERROR_CODE_400 = 400;
// const ERROR_CODE_404 = 404;
// const ERROR_CODE_500 = 500;

// создаёт пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, avatar, about,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      avatar,
      about,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new IncorrectDataError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

// возвращает всех пользователей
module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

// возвращает пользователя по _id
module.exports.getUserId = (req, res, next) => {
  if (req.params.userId.length !== 24) {
    // res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
    throw new IncorrectDataError('Переданы некорректные данные');
    // throw new IncorrectDataError('Пошел нахуй');
  } else {
    User.findById(req.params.userId)
      .then((user) => {
        if (user === null) {
          // res.status(ERROR_CODE_404).send({ message: 'Запрашиваемый пользователь не найден' });
          // throw new NotFoundError('Нет пользователя с таким id');
          throw new NotFoundError('Запрашиваемый пользователь не найден');
        } else {
          res.send({ data: user });
        }
      })
      // .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
      .catch(next);
  }
};

// GET /users/me - возвращает информацию о текущем пользователе
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

// PATCH /users/me — обновляет профиль
module.exports.patchUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new IncorrectDataError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

// PATCH /users/me/avatar — обновляет аватар
module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new IncorrectDataError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      // ошибка аутентификации
      throw new IncorrectDataError('Переданы некорректные данные');
    })
    .catch(next);
};
