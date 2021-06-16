const router = require('express').Router();
const {
  createCard, getCards, deleteCardId, likeCard, dislikeCard,
} = require('../controllers/cards');

router.post('/cards', createCard);
router.get('/cards', getCards);
router.delete('/cards/:cardsId', deleteCardId);
router.put('/cards/:cardsId/likes', likeCard);
router.delete('/cards/:cardsId/likes', dislikeCard);

module.exports = router;
