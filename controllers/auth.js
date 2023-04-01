const express = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = express.response) => {

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email: email })

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese email',
            })
        }

        usuario = new Usuario(req.body);

        const salt = bcrypt.genSaltSync();

        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        const token = await generarJWT(usuario._id, usuario.name)


        return res.status(201).json({
            ok: true,
            uid: usuario._id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al crear usuario',
        })
    }
}

const loginUsuario = async (req, res = express.response) => {
    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ email: email })

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con ese email',
            })
        }

        const validPassword = bcrypt.compareSync(password, usuario.password)

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto',
            })
        }

        // Generar JWT
        const token = await generarJWT(usuario._id, usuario.name)

        return res.status(200).json({
            ok: true,
            uid: usuario._id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al hacer Login',
        })
    }
}

const revalidarToken = async (req, res = express.response) => {

    const { uid, name } = req;

    const token = await generarJWT(uid, name)

    return res.json({
        ok: true,
        token,
        uid,
        name
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}