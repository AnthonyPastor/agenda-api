const express = require('express');
const jwt = require('jsonwebtoken');


const validarJWT = async (req, res = express.response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            of: false,
            msg: 'No hay token en la petición'
        })
    }

    try {
        const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);

        req.uid = uid;
        req.name = name;

    } catch (error) {
        console.error(error);

        return res.status(401).json({
            of: false,
            msg: 'Token no válido'
        })
    }

    next();
}

module.exports = { validarJWT }