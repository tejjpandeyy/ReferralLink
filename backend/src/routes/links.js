const express = require('express');
const {
  createLink,
  getLinks,
  getLinkById,
  updateLink,
  deleteLink
} = require('../controllers/linkController');

const router = express.Router();

router.post('/', createLink);
router.get('/', getLinks);
router.get('/:id', getLinkById);
router.put('/:id', updateLink);
router.delete('/:id', deleteLink);

module.exports = router;
