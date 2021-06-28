const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-err');

// создаёт карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new IncorrectDataError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

// возвращает все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
module.exports.deleteCardId = (req, res, next) => {
  if (req.params.cardsId.length !== 24) {
    throw new IncorrectDataError('Переданы некорректные данные');
  } else {
    Card.findById(req.params.cardsId)
      .then((card) => {
        if (card === null) {
          throw new NotFoundError('Запрашиваемая карточка не найдена');
        } else {
          console.log();
          if (req.user._id !== card.owner.toString()) {
            throw new IncorrectDataError('Не ваша карточка');
          } else {
            Card.findByIdAndRemove(req.params.cardsId)
              .then(res.send({ message: 'card deleted' }));
          }
        }
      })
      .catch(next);
  }
};

// PUT /cards/:cardId/likes — поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  if (req.params.cardsId.length !== 24) {
    throw new IncorrectDataError('Переданы некорректные данные');
  } else {
    Card.findById(req.params.cardsId)
      .then((card) => {
        if (card === null) {
          throw new NotFoundError('Запрашиваемая карточка не найдена');
        } else {
          Card.findByIdAndUpdate(
            req.params.cardsId,
            { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
            { new: true, runValidators: true },
          )
            .then(() => res.send({ card }));
        }
      })
      .catch(next);
  }
};

// DELETE /cards/:cardId/likes — убрать лайк с карточки
module.exports.dislikeCard = (req, res, next) => {
  if (req.params.cardsId.length !== 24) {
    throw new IncorrectDataError('Переданы некорректные данные');
  } else {
    Card.findById(req.params.cardsId)
      .then((card) => {
        if (card === null) {
          throw new NotFoundError('Запрашиваемая карточка не найдена');
        } else {
          Card.findByIdAndUpdate(
            req.params.cardsId,
            { $pull: { likes: req.user._id } }, // убрать _id из массива
            { new: true },
          )
            .then(() => res.send({ card }));
        }
      })
      .catch(next);
  }
};
