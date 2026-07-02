const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/studentController');
const { validateStudent, validateId } = require('../middlewares/validation');

router.get('/', controller.getAll);
router.get('/:id', validateId, controller.getById);
router.post('/', validateStudent, controller.create);
router.put('/:id', validateId, validateStudent, controller.update);
router.delete('/:id', validateId, controller.delete);

module.exports = router;