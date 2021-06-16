const User = require('../models/user');

const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

// создаёт пользователя
module.exports.createUser = (req, res) => {
  const { name, avatar, about } = req.body;

  User.create({ name, avatar, about })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка' });
      }
    });
};

// возвращает всех пользователей
module.exports.getUser = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// возвращает пользователя по _id
module.exports.getUserId = (req, res) => {
  if (req.params.userId.length !== 24) {
    res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
  } else {
    User.findById(req.params.userId)
      .then((user) => {
        if (user === null) {
          res.status(ERROR_CODE_404).send({ message: 'Запрашиваемый пользователь не найден' });
        } else {
          res.send({ data: user });
        }
      })
      .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
  }
};

// PATCH /users/me — обновляет профиль
module.exports.patchUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user === null) {
        res.status(ERROR_CODE_404).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

// PATCH /users/me/avatar — обновляет аватар
module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user === null) {
        res.status(ERROR_CODE_404).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
