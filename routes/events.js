const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const { getEventos, actualizarEvento, eliminarEvento, crearEvento } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

router.use(validarJWT);

router.get('/', validarJWT, getEventos);

router.post('/', [
    check('title', 'El titulo es obligatorio').isLength({ min: 0 }),
    check('start', 'Fecha de inicio es obligatoria').not().isEmpty(),
    check('start', 'Fecha de inicio no es válida').custom(isDate),
    check('end', 'Fecha de finalización es obligatoria').not().isEmpty(),
    check('end', 'Fecha de finalizacion no es válida').custom(isDate),

    validarCampos,
], crearEvento);

router.put('/:id', validarJWT, actualizarEvento);

router.delete('/:id', validarJWT, eliminarEvento);



module.exports = router;