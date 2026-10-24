const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');

router.get('/', cursoController.getAllCurso);
router.post('/', cursoController.createCurso);
router.put('/:id', cursoController.updateCurso);

module.exports = router;