const express = require('express');
const router = express.Router();
const controller = require('../controllers/courseController');
const { validateCourse, validateId } = require('../middlewares/validation');

router.get('/', controller.getAll);
router.get('/:id', validateId, controller.getById);
router.post('/', validateCourse, controller.create);
router.put('/:id', validateId, validateCourse, controller.update);
router.delete('/:id', validateId, controller.delete);

module.exports = router;