const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

router.post('/', [
    check('email', 'El mail es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser de al menos 6 caracteres').isLength({ min: 6 }),
    validarCampos
], loginUsuario)

router.post('/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El mail es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser de al menos 6 caracteres').isLength({ min: 6 }),
    validarCampos
], crearUsuario)

router.get('/renew', validarJWT, revalidarToken)

module.exports = router;